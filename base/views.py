import requests
import json
import os
import sys
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.conf import settings
from pydub import AudioSegment
from io import BytesIO
import logging
import numpy as np
from scipy import signal
from scipy.signal import butter, lfilter

import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages       
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404

from . models import Location, Category, LocationCategory
from . forms import CategoryForm
from . utils import geocode



# for spacy
import spacy
from spacy.language import Language
from .custom_tokenizer import create_custom_tokenizer, CustomTokenizer

# New

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'vosk-model-en-in-0.5')

TextModel_path = os.path.join(BASE_DIR, 'models', 'RouteQ-v1')

from django.views.decorators.csrf import csrf_exempt
from vosk import Model, KaldiRecognizer, SetLogLevel
import wave

try: 
    model = Model(MODEL_PATH)
    print("Vosk model loaded successfully")
except Exception as e:
    print(f"Error loading Vosk model: {str(e)}")
    model = None


# Create your views here.

def debug_view(request):
    return HttpResponse("<br>".join(sys.path))


logger = logging.getLogger(__name__)

def parse_query(nlp, text):
    doc = nlp(text)

    # Extract locations
    locations = [ent.text for ent in doc.ents if ent.label_ in ["LOCATION", "GPE", "LOC", "FAC"]]

    # Add potential locations based on location types
    for token in doc:
        if token.ent_type_ == "LOCATION_TYPE" and token.head.text not in locations:
            locations.append(f"{token.head.text} {token}")

    # Determine action
    action = "UNKNOWN"
    if doc.cats:
        action = max(doc.cats, key=doc.cats.get)

    return {
        "Locations": locations,
        "Action": action
    }

def process_audio(text, location=True):
    if not Language.has_factory("custom_tokenizer"):
        Language.factory("custom_tokenizer", func=create_custom_tokenizer)

    nlp = spacy.load(TextModel_path)

    res = parse_query(nlp, text)
    # print(res)
    if(location==True):
        # print(f"Locations: {res['Locations']}")
        return res['Locations']
    else:
        # print(f"Action: {res['Action']}")
        return res['Action']


@csrf_exempt
def transcribe_command(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    audio_file = request.FILES.get('audio')
    if not audio_file:
        return JsonResponse({'error': 'No audio file received'}, status=400)

    logger.info(f"Received audio file: {audio_file.name}, size: {audio_file.size} bytes")

    try:
        # Save the uploaded file temporarily
        with open('temp_audio.wav', 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        # Load and convert audio
        audio = AudioSegment.from_wav('temp_audio.wav')
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export('converted_audio.wav', format='wav')

        # Transcribe
        with wave.open('converted_audio.wav', 'rb') as wf:
            rec = KaldiRecognizer(model, wf.getframerate())
            
            result = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    result.append(json.loads(rec.Result())['text'])
            
            result.append(json.loads(rec.FinalResult())['text'])

        transcription = ' '.join(result)
        loc = process_audio(transcription.title(), location=False)
        logger.info(f"Transcription completed: {transcription.title()}")
        return JsonResponse({'transcription': loc}) 

    except Exception as e:
        logger.exception(f"Transcription error: {str(e)}")
        return JsonResponse({'error': f'Transcription error: {str(e)}'}, status=500)

    finally:
        # Clean up temporary files
        if os.path.exists('temp_audio.wav'):
            os.remove('temp_audio.wav')
        if os.path.exists('converted_audio.wav'):
            os.remove('converted_audio.wav')



@csrf_exempt
def transcribe_audio(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    audio_file = request.FILES.get('audio')
    if not audio_file:
        return JsonResponse({'error': 'No audio file received'}, status=400)

    logger.info(f"Received audio file: {audio_file.name}, size: {audio_file.size} bytes")

    try:
        # Save the uploaded file temporarily
        with open('temp_audio.wav', 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        # Load and convert audio
        audio = AudioSegment.from_wav('temp_audio.wav')
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export('converted_audio.wav', format='wav')

        # Transcribe
        with wave.open('converted_audio.wav', 'rb') as wf:
            rec = KaldiRecognizer(model, wf.getframerate())
            
            result = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    result.append(json.loads(rec.Result())['text'])
            
            result.append(json.loads(rec.FinalResult())['text'])

        transcription = ' '.join(result)
        loc = process_audio(transcription.title())
        if len(loc) <= 1:
            logger.info(f"Transcription completed: {transcription.title()}")
            return JsonResponse({'transcription': loc}) 
        elif len(loc) > 1:
            logger.info(f"Transcription completed: {transcription.title()}")
            # print(loc[0], loc[1])
            get_route_1(loc[0], loc[1])
            return JsonResponse({'transcription': loc}) 

    except Exception as e:
        logger.exception(f"Transcription error: {str(e)}")
        return JsonResponse({'error': f'Transcription error: {str(e)}'}, status=500)

    finally:
        # Clean up temporary files
        if os.path.exists('temp_audio.wav'):
            os.remove('temp_audio.wav')
        if os.path.exists('converted_audio.wav'):
            os.remove('converted_audio.wav')

CUSTOM_WORDS = [
    "route", "navigate", "destination", "street", "avenue", "boulevard", "road", "highway",
    "north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest",
    "city", "town", "village", "county", "state", "country", "continent",
    "map", "directions", "turn", "left", "right", "straight", "roundabout", "intersection",
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
    "San Diego", "Dallas", "San Jose", "London", "Paris", "Tokyo", "Sydney", "Mumbai", "Beijing",
    "Hyderabad"
]

def create_custom_dict(words):
    return json.dumps([{"word": w.lower(), "phones": " ".join(w.lower())} for w in words])

CUSTOM_DICT = create_custom_dict(CUSTOM_WORDS)


# Set Vosk logging level
SetLogLevel(0)

def butter_highpass(cutoff, fs, order=5):
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = butter(order, normal_cutoff, btype='high', analog=False)
    return b, a

def highpass_filter(data, cutoff, fs, order=5):
    b, a = butter_highpass(cutoff, fs, order=order)
    y = lfilter(b, a, data)
    return y


def testing(request):
    return render(request, 'base/test.html')

lst = []

def updated_location(loc=None):
    if loc is not None:
        lst.append(loc)
    prev_location = lst[0]
    if len(lst) > 1:
        del lst[0] 
    return prev_location

def home(request):
    def geocode(location):
        # First, check if the location exists in the database
            location_obj = Location.objects.filter(name__iexact=location).first()
            if location_obj:
                # print("From the Database")
                return location_obj.longitude, location_obj.latitude

            # If not in database, use the API
            api_key = settings.OPENROUTE_API_KEY
            headers = {
                'Authorization': api_key,
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
            # print("Sending GeoCode")
            geocode_url = "https://api.openrouteservice.org/geocode/search"
            params = {'text': location}
            response = requests.get(geocode_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if data['features']:
                coordinates = data['features'][0]['geometry']['coordinates']
                # Save the new location to the database
                Location.objects.create(
                    name=location,
                    longitude=coordinates[0],
                    latitude=coordinates[1]
                )
                return coordinates
            return None

    context = {'lat': 0, 'lng': 0,}  # Default values for initial page load

    if request.method == 'POST':
        loc = request.POST.get('location')
        # print(f"Received location: {loc}")
        updated_location(loc)
        processed = process_audio(loc)
        if len(processed) <= 1:
            res = geocode(loc)
            # print(f"Geocoding result: {res}")
            if res:
                lng, lat = res  # OpenRouteService returns [longitude, latitude]
                context = {
                    "lat": lat,
                    "lng": lng,
                    "location": loc,
                }
                
                # If it's an AJAX request, return JSON response
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse(context)
            else:
                context = {"error": "Location not found",}
        elif len(processed) > 1:
            context = {
                    "lat": 0,
                    "lng": 0,
                    "location": f"{processed[0]}, {processed[1]}",
                }
            updated_location(processed[1])
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse(context)
        else:
            context = {"error": "No location provided",}

    return render(request, 'base/home.html', context)

def get_route(request):
    if request.method == 'POST':
        start = request.POST.get('start')
        end = request.POST.get('end')

        api_key = settings.OPENROUTE_API_KEY
        headers = {
            'Authorization': api_key,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }

        def geocode(location):
            # print("Sending GeoCode")
            geocode_url = "https://api.openrouteservice.org/geocode/search"
            params = {'text': location}
            response = requests.get(geocode_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if data['features']:
                # print(data['features'][0]['geometry']['coordinates'])
                return data['features'][0]['geometry']['coordinates']
            return None

    
        try:
            start_coords = geocode(start)
            end_coords = geocode(end)

            # print(start_coords)
            # print(end_coords)

            if not start_coords or not end_coords:
                return JsonResponse({"error": "Could not geocode one or both locations."}, status=400)

            route_url = "https://api.openrouteservice.org/v2/directions/driving-car"
            
            params = {
                "start": f"{start_coords[0]},{start_coords[1]}",
                "end": f"{end_coords[0]},{end_coords[1]}",
            }
            
            # print("Getting Route")
            response = requests.get(route_url, headers=headers, params=params)
            response.raise_for_status()
            route_data = response.json()

            if 'features' in route_data and len(route_data['features']) > 0:
                # Extract turn-by-turn directions
                steps = route_data['features'][0]['properties']['segments'][0]['steps']
                directions = [{"instruction": step['instruction'], "distance": step['distance']} for step in steps]
                
                route_data['start'] = start_coords
                route_data['end'] = end_coords

                # Add directions to the response
                route_data['directions'] = directions
                
                return JsonResponse(route_data)
            else:
                return JsonResponse({"error": "No route found."}, status=400)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": str(e)}, status=400)

    return render(request, 'base/route.html')

def get_route_1(start, end):
        # print("Here In Route 1")
        api_key = settings.OPENROUTE_API_KEY
        headers = {
            'Authorization': api_key,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }

        # def geocode(location):
        #     print("Sending GeoCode")
        #     geocode_url = "https://api.openrouteservice.org/geocode/search"
        #     params = {'text': location}
        #     response = requests.get(geocode_url, headers=headers, params=params)
        #     response.raise_for_status()
        #     data = response.json()
        #     # print(data)
        #     if data['features']:
        #         # print(data['features'][0]['geometry']['coordinates'])
        #         return data['features'][0]['geometry']['coordinates']
        #     return None
        def geocode(location):
        # First, check if the location exists in the database
            location_obj = Location.objects.filter(name__iexact=location).first()
            if location_obj:
                # print("From the Database, Route Data")
                return location_obj.longitude, location_obj.latitude

            # If not in database, use the API
            api_key = settings.OPENROUTE_API_KEY
            headers = {
                'Authorization': api_key,
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
            # print("Sending GeoCode from Route Data")
            geocode_url = "https://api.openrouteservice.org/geocode/search"
            params = {'text': location}
            response = requests.get(geocode_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if data['features']:
                coordinates = data['features'][0]['geometry']['coordinates']
                # Save the new location to the database
                Location.objects.create(
                    name=location,
                    longitude=coordinates[0],
                    latitude=coordinates[1]
                )
                return coordinates
            return None

    
        try:
            start_coords = geocode(start)
            end_coords = geocode(end)

            # print(start_coords)
            # print(end_coords)

            if not start_coords or not end_coords:
                return JsonResponse({"error": "Could not geocode one or both locations."}, status=400)

            route_url = "https://api.openrouteservice.org/v2/directions/driving-car"
            
            params = {
                "start": f"{start_coords[0]},{start_coords[1]}",
                "end": f"{end_coords[0]},{end_coords[1]}",
            }
            
            # print("Getting Route")
            response = requests.get(route_url, headers=headers, params=params)
            response.raise_for_status()
            route_data = response.json()

            if 'features' in route_data and len(route_data['features']) > 0:
                # Extract turn-by-turn directions
                steps = route_data['features'][0]['properties']['segments'][0]['steps']
                directions = [{"instruction": step['instruction'], "distance": step['distance']} for step in steps]
                
                route_data['start'] = start_coords
                route_data['end'] = end_coords

                # Add directions to the response
                route_data['directions'] = directions
                
                return JsonResponse(route_data)
            else:
                return JsonResponse({"error": "No route found."}, status=400)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def get_route_data(request):
    # print("Here In Route Data")
    if request.method == 'POST':
        data = json.loads(request.body)
        start = data.get('start')
        end = data.get('end')
        
        if not start or not end:
            return JsonResponse({'error': 'Start and end locations are required'}, status=400)
        
        api_key = settings.OPENROUTE_API_KEY
        headers = {
            'Authorization': api_key,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
        def geocode(location):
        # First, check if the location exists in the database
            location_obj = Location.objects.filter(name__iexact=location).first()
            if location_obj:
                # print("From the Database, Route Data")
                return location_obj.longitude, location_obj.latitude

            # If not in database, use the API
            api_key = settings.OPENROUTE_API_KEY
            headers = {
                'Authorization': api_key,
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
            # print("Sending GeoCode from Route Data")
            geocode_url = "https://api.openrouteservice.org/geocode/search"
            params = {'text': location}
            response = requests.get(geocode_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if data['features']:
                coordinates = data['features'][0]['geometry']['coordinates']
                # Save the new location to the database
                Location.objects.create(
                    name=location,
                    longitude=coordinates[0],
                    latitude=coordinates[1]
                )
                return coordinates
            return None

        try:
            start_coords = geocode(start)
            end_coords = geocode(end)

            if not start_coords or not end_coords:
                return JsonResponse({"error": "Could not geocode one or both locations."}, status=400)

            route_url = "https://api.openrouteservice.org/v2/directions/driving-car"
            
            params = {
                "start": f"{start_coords[0]},{start_coords[1]}",
                "end": f"{end_coords[0]},{end_coords[1]}",
            }
            
            response = requests.get(route_url, headers=headers, params=params)
            response.raise_for_status()
            route_data = response.json()

            if 'features' in route_data and len(route_data['features']) > 0:
                # Extract turn-by-turn directions
                steps = route_data['features'][0]['properties']['segments'][0]['steps']
                directions = [{"instruction": step['instruction'], "distance": step['distance']} for step in steps]
                
                # Add start and end coordinates to the response
                route_data['start'] = start_coords
                route_data['end'] = end_coords
                # Sendind Location
                route_data['loc-1'] = start
                route_data['loc-2'] = end

                # Add directions to the response
                route_data['directions'] = directions
                
                return JsonResponse(route_data)
            else:
                return JsonResponse({"error": "No route found."}, status=400)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)        



weather_codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Dense fog",
    51: "Drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    60: "Slight rain",
    61: "Moderate rain",
    63: "Heavy rain",
    65: "Extreme rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

@csrf_exempt
def process_weather(request):
    if request.method == 'POST':
        # Get latitude and longitude from the POST request
        latitude = float(request.POST.get('latitude'))
        longitude = float(request.POST.get('longitude'))

        # Setup the Open-Meteo API client with cache and retry on error
        cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        openmeteo = openmeteo_requests.Client(session=retry_session)

        # Define the weather variables to request from the API
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "is_day",
            "hourly": ["temperature_2m", "relative_humidity_2m", "rain", "weather_code", "visibility"],
            "daily": ["sunrise", "sunset", "daylight_duration", "sunshine_duration", "uv_index_max"],
            "timezone": "auto"
        }
        responses = openmeteo.weather_api(url, params=params)

        # Process the first location
        response = responses[0]
        timezone_str = response.Timezone().decode('utf-8')  # Decode bytes to string

        current = response.Current()
        current_is_day = current.Variables(0).Value()

        current_time = pd.to_datetime(current.Time(), unit="s", utc=True).tz_convert(timezone_str)

        # Process hourly data
        hourly = response.Hourly()
        hourly_temperature = hourly.Variables(0).ValuesAsNumpy()
        hourly_relative_humidity = hourly.Variables(1).ValuesAsNumpy()
        hourly_rain = hourly.Variables(2).ValuesAsNumpy()
        hourly_weather_code = hourly.Variables(3).ValuesAsNumpy()
        hourly_visibility = hourly.Variables(4).ValuesAsNumpy()

        hourly_data = {"local_time": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True).tz_convert(timezone_str),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True).tz_convert(timezone_str),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        )}
        hourly_data["temperature_2m"] = hourly_temperature
        hourly_data["relative_humidity_2m"] = hourly_relative_humidity
        hourly_data["rain"] = hourly_rain
        hourly_data["weather_code"] = hourly_weather_code
        hourly_data["visibility"] = hourly_visibility

        hourly_dataframe = pd.DataFrame(data=hourly_data)

        hourly_dataframe['weather_description'] = hourly_dataframe['weather_code'].map(weather_codes)

        # Process daily data
        daily = response.Daily()
        daily_sunrise = daily.Variables(0).ValuesAsNumpy()
        daily_sunset = daily.Variables(1).ValuesAsNumpy()
        daily_daylight_duration = daily.Variables(2).ValuesAsNumpy()
        daily_sunshine_duration = daily.Variables(3).ValuesAsNumpy()
        daily_uv_index_max = daily.Variables(4).ValuesAsNumpy()

        daily_data = {"local_date": pd.date_range(
            start=pd.to_datetime(daily.Time(), unit="s", utc=True).tz_convert(timezone_str).date(),
            end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True).tz_convert(timezone_str).date(),
            freq=pd.Timedelta(days=1),
            inclusive="left"
        )}
        daily_data["sunrise"] = daily_sunrise
        daily_data["sunset"] = daily_sunset
        daily_data["daylight_duration"] = daily_daylight_duration
        daily_data["sunshine_duration"] = daily_sunshine_duration
        daily_data["uv_index_max"] = daily_uv_index_max

        daily_dataframe = pd.DataFrame(data=daily_data)

        # Prepare the JSON response
        location = updated_location()
        weather_data = {
            "location": {
                "latitude": response.Latitude(),
                "longitude": response.Longitude(),
                "elevation": response.Elevation(),
                "timezone": response.Timezone().decode('utf-8'),
                "timezone_abbreviation": response.TimezoneAbbreviation().decode('utf-8'),
                "location": location
            },
            "current": {
                "time": current_time.strftime('%Y-%m-%d %H:%M:%S'),
                "is_day": current_is_day
            },
            "hourly": hourly_dataframe.to_dict('records'),
            "daily": daily_dataframe.to_dict('records')
        }

        return JsonResponse(weather_data, safe=False)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


def login_view(request):
    page = 'login'
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username').lower()
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user) 
            return redirect('home') 
        else:
            messages.error(request, 'Invalid username or password')  

    context = {'page':page}
    return render(request, 'base/register.html', context)     


@login_required(login_url='login')
def logout_view(request):
    logout(request)
    return redirect('home')



def register_view(request): 
    form = UserCreationForm()
    if request.method == 'POST':  
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('home')

    context = {'form':form}    
    return render(request, 'base/register.html', context)      


@login_required
@require_POST
def create_category(request):
    data = json.loads(request.body)
    form = CategoryForm(data)
    if form.is_valid():
        category = form.save(commit=False)
        category.user = request.user
        category.save()
        return JsonResponse({
            'success': True, 
            'category_id': category.id, 
            'category_name': category.name
        })
    else:
        return JsonResponse({
            'success': False, 
            'errors': form.errors
        }, status=400)


@login_required
def fetch_categories(request):
    categories = Category.objects.filter(user=request.user).prefetch_related('locations')
    data = [{
        'id': category.id,
        'name': category.name,
        'locations': [{'id': loc.id, 'name': loc.name} for loc in category.locations.all()]
    } for category in categories]
    return JsonResponse(data, safe=False)


@login_required
@require_POST
def add_location(request, category_id):
    data = json.loads(request.body)
    location_name = data.get('name')

    if not location_name:
        return JsonResponse({'success': False, 'errors': 'Location name is required'}, status=400)

    try:
        category = Category.objects.get(id=category_id, user=request.user)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'errors': 'Category not found'}, status=404)

    # Use the geocode function to get coordinates
    coordinates = geocode(location_name)

    if coordinates is None:
        return JsonResponse({'success': False, 'errors': 'Unable to geocode location'}, status=400)

    longitude, latitude = coordinates

    # Check if both latitude and longitude are not None
    if latitude is None or longitude is None:
        return JsonResponse({'success': False, 'errors': 'Invalid coordinates returned from geocoding'}, status=400)

    # Use get_or_create to avoid duplicates
    location, created = Location.objects.get_or_create(
        name=location_name,
        defaults={'latitude': latitude, 'longitude': longitude}
    )

    # If the location already existed, update its coordinates
    if not created:
        location.latitude = latitude
        location.longitude = longitude
        location.save()

    # Add the location to the category
    category.locations.add(location)

    return JsonResponse({
        'success': True,
        'location_id': location.id,
        'location_name': location.name,
        'latitude': location.latitude,
        'longitude': location.longitude
    })


@require_http_methods(["DELETE"])
def delete_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    category.delete()
    return JsonResponse({"success": True})

@require_http_methods(["DELETE"])
def delete_location(request, location_id):
    location = get_object_or_404(Location, id=location_id)
    location.delete()
    return JsonResponse({"success": True})

def doc(request):
    return render(request, 'base/doc.html')  


# def contact(request):
#     return render(request, 'base/contact.html')
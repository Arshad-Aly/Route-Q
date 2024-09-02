from . models import Location
from django.conf import settings
import requests


def geocode(location):
        # First, check if the location exists in the database
            location_obj = Location.objects.filter(name__iexact=location).first()
            if location_obj:
                print("From the Database")
                return location_obj.longitude, location_obj.latitude

            # If not in database, use the API
            api_key = settings.OPENROUTE_API_KEY
            headers = {
                'Authorization': api_key,
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
            print("Sending GeoCode")
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
// document.addEventListener('DOMContentLoaded', function() {
//     const menuToggle = document.getElementById('menu-toggle');
//     const sidebar = document.getElementById('sidebar');

//     menuToggle.addEventListener('click', function() {
//         sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
//     });

//     function handleResize() {
//         if (window.innerWidth > 768) {
//             sidebar.style.display = 'block';
//         } else {
//             sidebar.style.display = 'none';
//         }
//     }

//     window.addEventListener('resize', handleResize);

//     handleResize(); // Initial call
// });

//////////////////////////////////////////

// Get the tab dropdown and content containers
const tabsDropdown = document.getElementById('tabs');
const statsContent = document.getElementById('stats');
const aboutContent = document.getElementById('about');
const faqContent = document.getElementById('faq');

// Add event listener to the tab dropdown
tabsDropdown.addEventListener('change', () => {
    const selectedOption = tabsDropdown.value;

  // Show the corresponding content based on the selected option
    switch (selectedOption) {
    case 'General':
        showStatsContent();
        break;
    case 'Hourly':
        showAboutContent();
        break;
    case 'Daily':
        showFaqContent();
        break;
    }
});

// Functions to show the corresponding content
function showStatsContent() {
    statsContent.classList.remove('hidden');
    aboutContent.classList.add('hidden');
    faqContent.classList.add('hidden');
}

function showAboutContent() {
    statsContent.classList.add('hidden');
    aboutContent.classList.remove('hidden');
    faqContent.classList.add('hidden');
}

function showFaqContent() {
    statsContent.classList.add('hidden');
    aboutContent.classList.add('hidden');
    faqContent.classList.remove('hidden');
}

/////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');

    function toggleSidebar() {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    }

    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);

    function handleResize() {
        if (window.innerWidth >= 1024) {  // lg breakpoint
            sidebar.style.display = 'block';
        } else {
            sidebar.style.display = 'none';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
});

document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarSticky = document.getElementById('navbar-sticky');

    navbarToggle.addEventListener('click', function() {
        navbarSticky.classList.toggle('hidden');
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
});

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
});

// var map = L.map('map', {
//     center: [0, 0],
//     zoom: 2,
//     maxBounds: [[-90, -180], [90, 180]],
//     maxBoundsViscosity: 1.0,
//     layers: [openStreetMap]
// });

let map;
let routeGroup;

document.addEventListener('DOMContentLoaded', function() {
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        layers: [openStreetMap]
    });

    // Rest of your map-related code...
    var baseLayers = {
        "OpenStreetMap": openStreetMap,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
        "Google Satellite": googleSat,
        "Google Terrain": googleTerrain
    };
    // Add layer control to the map
    L.control.layers(baseLayers).addTo(map);

    routeGroup = L.layerGroup().addTo(map);
    
    // Current layer index
    var currentLayerIndex = 0;
    
    // Create an array of layer instances
    var layerInstances = Object.values(baseLayers);
    
    // Function to change the layer
    function changeLayer() {
    
        map.removeLayer(layerInstances[currentLayerIndex]);
    
        // Move to the next layer, wrapping around to the start if we're at the end
        currentLayerIndex = (currentLayerIndex + 1) % layerInstances.length;
        
        // Add the new layer
        layerInstances[currentLayerIndex].addTo(map);
        
        // console.log("Switched to layer: " + Object.keys(baseLayers)[currentLayerIndex]);
    }
    // Add click event listener to the layer changing button
    document.querySelector('.fa-layer-group').parentElement.addEventListener('click', changeLayer);


});





// Function to display the custom alert message
function showCustomAlert(message) {
    const Div = document.querySelector('#alert');
    const alertDiv = `
    <div id="alert-1" class="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
        <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span class="sr-only">Info</span>
        <div class="ms-3 text-sm font-medium">
            ${message}
        </div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-1" id="alert-close-btn" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
        </div>
    `

    Div.innerHTML = alertDiv;


    const closeButton = document.getElementById('alert-close-btn');
    closeButton.addEventListener('click', () => {
        Div.innerHTML = '';
    });

    // Remove the alert after 5 seconds
    setTimeout(() => {
        Div.innerHTML = '';
    }, 7000);
}



// *************************************************************************

// Variable to store markers and line
var markers = [];
var line = null;
var isRoutingMode = false;

// Function to clear existing markers and line
function clearMapElements() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (line) {
        map.removeLayer(line);
        line = null;
    }
}

// Function to handle map clicks for distance calculation
function onMapClick(e) {
    if (markers.length < 2) {
        var marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);
        
        if (markers.length === 2) {
            calculateDistance();
        }
    }
}

// Function to calculate and display distance
function calculateDistance() {
    if (markers.length !== 2) return;

    var start = markers[0].getLatLng();
    var end = markers[1].getLatLng();

    // Create a line between the two points
    line = L.polyline([start, end], {color: 'blue'}).addTo(map);
    
    // Fit the map to the line bounds
    map.fitBounds(line.getBounds());
    
    // Calculate the distance
    var distance = start.distanceTo(end) / 1000; // Convert to km
    
    // Display distance info
    //alert(`Direct distance: ${distance.toFixed(2)} km\nNote: This is a straight line distance, not a road route.`);
    showCustomAlert(`Direct distance: ${distance.toFixed(2)} km. \nNote: This is a straight line distance, not a road route.`)
}

// Function to toggle distance calculation mode
function toggleDistanceMode() {
    isRoutingMode = !isRoutingMode;
    clearMapElements();
    
    if (isRoutingMode) {
        map.on('click', onMapClick);
        alert("Distance calculation mode activated. Click on two locations to measure the distance.");
        setTimeout(() => {
            toggleDistanceMode();
        }, 7000);
    } else {
        map.off('click', onMapClick);
        alert("Distance calculation mode deactivated.");
    }
}

// Add click event listener to the distance calculation button
document.querySelector('.fa-location-dot').parentElement.addEventListener('click', toggleDistanceMode);



// ***************************************************************************

var marker;

let ls_latlng = [];
function latAndlng_for_weather(lat=0 , lng=0, flag){

    if(flag === true){
        ls_latlng.push(lat)
        ls_latlng.push(lng)
    }else{
        if(ls_latlng.length > 2){
            ls_latlng.shift()
            ls_latlng.shift()
        }
        return ls_latlng
    }

    
}

let globalEnableWeatherToggle;

function InUpdateForWeatherStatus(){
     // Hide the tabs if they're currently visible
    const tabsCard = document.getElementById('tabsCard');
    if (!tabsCard.classList.contains('hidden')) {
        tabsCard.classList.add('hidden');
        
         // Reset the toggle button state
        const weatherToggleButton = document.getElementById('weatherToggleButton');
        const weatherToggleCircle = document.getElementById('weatherToggleCircle');
        weatherToggleButton.classList.add('bg-gray-300');
        weatherToggleButton.classList.remove('bg-blue-500');
        weatherToggleCircle.classList.remove('translate-x-4');
    }
    
    if (globalEnableWeatherToggle) {
        globalEnableWeatherToggle();
    }
}



function updateMap(lat, lng, loc) {
    // console.log("Updating map with:", lng, lat, loc);
    latAndlng_for_weather(lat, lng, true)
    map.setView([lat, lng], 13);
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`${loc}`)
        .openPopup();
    
    // Show the voice command button after location is set
    document.getElementById('voiceCommandButton').classList.remove('hidden');
    
     // Hide the tabs if they're currently visible

    InUpdateForWeatherStatus();
    
}

// Handle form submission
document.getElementById('routeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    fetch('', {  // Empty string means submit to the same URL
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        let result = separateString(data.location);
        if (result.length > 1){
            getRouteData(result[0], result[1]);
        }
        else if (data.lat && data.lng) {
            updateMap(data.lat, data.lng, data.location);
            // console.log(data.location)
        } else if (data.error) {
            alert(data.error);
        } else {
            console.error('Invalid response:', data);
        }
    })
    .catch(error => console.error('Error:', error));
});



// Voice command functionality
let voiceCommandRecorder;
let voiceCommandStream;
let voiceCommandAudioChunks = [];

document.getElementById('voiceCommandButton').addEventListener('click', toggleVoiceCommand);

function toggleVoiceCommand() {
    if (voiceCommandRecorder && voiceCommandRecorder.state === 'recording') {
        stopVoiceCommand();
    } else {
        startVoiceCommand();
    }
}

function startVoiceCommand() {
    navigator.mediaDevices.getUserMedia({
        audio: {
            channelCount: 1,
            sampleRate: 16000
        }
    })
    .then(streamObject => {
        voiceCommandStream = streamObject;
        voiceCommandRecorder = new MediaRecorder(voiceCommandStream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 16000
        });
        voiceCommandRecorder.start();

        voiceCommandRecorder.addEventListener("dataavailable", event => {
            voiceCommandAudioChunks.push(event.data);
        });

        voiceCommandRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(voiceCommandAudioChunks, { type: 'audio/webm' });
            sendVoiceCommandToServer(audioBlob);
            voiceCommandAudioChunks = [];
        });

        // Change button appearance to indicate recording
        document.getElementById('voiceCommandButton').style.background = "red";
        // console.log("Voice command recording started");
    })
    .catch(error => {
        console.error('Error accessing the voice command microphone', error);
        alert('Error accessing the voice command microphone. Please ensure you have granted the necessary permissions.');
    });
    setTimeout(() => {
        stopVoiceCommand()
    }, 3000)
}

function stopVoiceCommand() {
    if (voiceCommandRecorder) {
        voiceCommandRecorder.stop();
        voiceCommandStream.getTracks().forEach(track => track.stop());
    }
    // Revert button appearance
    document.getElementById('voiceCommandButton').style.removeProperty("background");
}

function sendVoiceCommandToServer(audioBlob) {
    // Convert to WAV if it's not already
    if (audioBlob.type !== 'audio/wav') {
        const reader = new FileReader();
        reader.onload = function(event) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(event.target.result).then(function(buffer) {
                const wavBlob = bufferToWavCommand(buffer);
                sendWavToServerCommand(wavBlob);
            });
        };
        reader.readAsArrayBuffer(audioBlob);
    } else {
        sendWavToServerCommand(audioBlob);
    }
}

function sendWavToServerCommand(wavBlob) {
    const formData = new FormData();
    formData.append('audio', wavBlob, 'command.wav');

    fetch('/transcribe_command/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.transcription) {
            executeCommand(data.transcription);
        } else if (data.error) {
            console.error('Voice command error:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function executeCommand(command) {
    switch(command.toLowerCase()) {
        case 'zoom_in':
            zoomIn();
            break;
        case 'zoom_out':
            zoomOut();
            break;
        case 'change layout':
            // Implement layout change logic here
            // console.log('Changing layout');
            break;
        // Add more commands as needed
        default:
            console.log('Unknown command:', command);
    }
}

function bufferToWavCommand(abuffer) {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2;
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(36 + length);                        // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length);                             // chunk length

    // write interleaved data
    for(let i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while(pos < abuffer.length) {
        for(let i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
            view.setInt16(44 + offset, sample, true); // write 16-bit sample
            offset += 2;
        }
        pos++;
    }

    // create Blob
    return new Blob([buffer], {type: "audio/wav"});

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}



// Assuming 'map' is your Leaflet map object
let cnt = 0;
let currentZoom = 17; //map.getZoom();
const MAX_ZOOM = 18;  // Adjust as needed
const MIN_ZOOM = 1;   // Adjust as needed

function zoomIn() {
    if (currentZoom < MAX_ZOOM) {
        console.log(`Current Zoom: ${currentZoom}`)
        currentZoom++;
        map.setZoom(currentZoom);
        console.log(`Zoomed in to level ${currentZoom}`);
    } else {
        console.log("Already at maximum zoom level");
    }
}

function zoomOut() {
    if (currentZoom > MIN_ZOOM) {
        currentZoom--;
        map.setZoom(currentZoom);
        console.log(`Zoomed out to level ${currentZoom}`);
    } else {
        console.log("Already at minimum zoom level");
    }
}



let mediaRecorder;
let audioChunks = [];
let stream; // added for mic


function startRecording() {
navigator.mediaDevices.getUserMedia({ 
    audio: {
        channelCount: 1,
        sampleRate: 16000
    } 
})
.then(streamObject => {
    stream = streamObject;
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000
    });
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        sendAudioToServer(audioBlob);
        audioChunks = [];
    });

    document.getElementById('startButton').style.display = 'none';
    document.getElementById('stopButton').style.display = 'inline-block';
})
.catch(error => {
    console.error('Error accessing the microphone', error);
    alert('Error accessing the microphone. Please ensure you have granted the necessary permissions.');
});
    setTimeout(() => {
        stopRecording()
    }, 5000)
}


function updateInputField(text) {
// console.log(typeof text);

let processedText = '';

if (typeof text === 'object' && text !== null) {
    // Assuming the object has properties like {0: "Hyderabad", 1: "Anurag University"}
    const values = Object.values(text);
    
    if (values.length >= 2) {
        processedText = `from ${values[0]} to ${values[1]}`;
    } else if (values.length === 1) {
        processedText = values[0];
    } else {
        console.error('Invalid input object structure:', text);
        processedText = 'Invalid input';
    }
} else {
    // If it's not an object, use it as is (fallback)
    processedText = String(text);
}

document.querySelector('#Inp').value = processedText;
}


function stopRecording() {
if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
}

if (stream) {
    stream.getTracks().forEach(track => track.stop());
}

document.getElementById('startButton').style.display = 'inline-block';
document.getElementById('stopButton').style.display = 'none';
}


function sendAudioToServer(audioBlob) {
// Convert to WAV if it's not already
if (audioBlob.type !== 'audio/wav') {
    const reader = new FileReader();
    reader.onload = function(event) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result).then(function(buffer) {
            const wavBlob = bufferToWav(buffer);
            sendWavToServer(wavBlob);
        });
    };
    reader.readAsArrayBuffer(audioBlob);
} else {
    sendWavToServer(audioBlob);
}
}

function sendWavToServer(wavBlob) {
const formData = new FormData();
formData.append('audio', wavBlob, 'recording.wav');

fetch('/transcribe/', {
    method: 'POST',
    body: formData,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken')
    }
})
.then(response => response.json())
.then(data => {
    if (data.transcription) {
        document.getElementById('transcription').textContent = data.transcription;
        updateInputField(data.transcription);
        // console.log(`Updating the Input with: ${data.transcription}`)
        submitForm();
    } else if (data.error) {
        console.error('Transcription error:', data.error);
        document.getElementById('transcription').textContent = 'Error: ' + data.error;
    }
})
.catch(error => {
    console.error('Error:', error);
    document.getElementById('transcription').textContent = 'An error occurred. Please try again.';
});
}


// Create a LayerGroup to hold all markers and routes
// let routeGroup = L.layerGroup().addTo(map);  I HAVE COMMENTED TO ADD IT TO TOP ***********************

function showRoute(routeData) {
// Clear existing route and markers
routeGroup.clearLayers();

//console.log(routeData);

// Extract coordinates from the route data
const coordinates = routeData.features[0].geometry.coordinates;

// Create a polyline
const routePath = L.polyline(coordinates.map(coord => [coord[1], coord[0]]), {
color: 'blue',
weight: 5,
opacity: 0.7
});
// Add start marker
L.marker([routeData.start[1], routeData.start[0]], {
autoPanOnFocus: true,
// draggable: true
}).addTo(routeGroup)
.bindPopup(`${routeData['loc-1']}`)
.openPopup();


// Add end marker
L.marker([routeData.end[1], routeData.end[0]], {
autoPanOnFocus: true,
// draggable: true
}).addTo(routeGroup)
.bindPopup(`${routeData['loc-2']}`)
.openPopup();

// Add the polyline to the route group
routePath.addTo(routeGroup);

latAndlng_for_weather(routeData.end[1], routeData.end[0], flag=true)

// Fit the map to the route bounds
map.fitBounds(routePath.getBounds());

// Display turn-by-turn directions if available
if (routeData.directions) {
displayDirections(routeData);
}
}

function displayDirections(data) {

var distance = data.features[0].properties.summary.distance;
var duration = data.features[0].properties.summary.duration;

document.getElementById('routeInfo').innerHTML = `
    <p><strong>Distance</strong>: ${(distance / 1000).toFixed(2)} km</p>
    <p><strong>Duration</strong>: ${(duration / 60).toFixed(2)} minutes</p>
`;

var directionsHtml = '<strong>Turn-by-Turn Directions:</strong><ul>';
    data.directions.forEach(step => {
        directionsHtml += `<li>${step.instruction} (${step.distance.toFixed(2)} m)</li>`;
    });
    directionsHtml += '</ul>';
    document.getElementById('directions').innerHTML = directionsHtml;
}


function submitForm() {
const form = document.getElementById('routeForm');
const formData = new FormData(form);

fetch('', {
    method: 'POST',
    body: formData,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken')
    }
})
.then(response => response.json())
.then(data => {
    // console.log(data)
    let result = separateString(data.location);
    // console.log(result.length)
    if (result.length > 1) {
        // If we have multiple locations, request the route
        // console.log(result[0], result[1])
        getRouteData(result[0], result[1]);
    } else if (data.lat && data.lng) {
        // If we have a single location with coordinates
        updateMap(data.lat, data.lng, data.location);
    } else if (data.location && data.location.length === 1) {
        // If we have a single location without coordinates
        updateMapForSingleLocation(data.transcription[0]);
    } else if (data.error) {
        alert(data.error);
    } else {
        console.error('Invalid response:', data);
    }
})
.catch(error => console.error('Error:', error));
}

function separateString(input) {
return input.split(',');
}

function getRouteData(start, end) {
fetch('/get_route_data/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ start: start, end: end })
})
.then(response => response.json())
.then(data => {
    if (data.features) {
        showRoute(data);
    } else if (data.error) {
        console.error('Route error:', data.error);
        document.getElementById('transcription').textContent += '\nError getting route: ' + data.error;
    }
})
.catch(error => {
    console.error('Error:', error);
    document.getElementById('transcription').textContent += '\nAn error occurred while getting the route. Please try again.';
});

// Show the voice command button after location is set
document.getElementById('voiceCommandButton').classList.remove('hidden');

InUpdateForWeatherStatus();
}

function updateMapForSingleLocation(location) {
// Assuming you're using a mapping library like Leaflet
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map)
                .bindPopup(location)
                .openPopup();
        } else {
            console.error('Location not found');
            document.getElementById('transcription').textContent += '\nLocation not found on map.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('transcription').textContent += '\nAn error occurred while updating the map. Please try again.';
    });
}

// Function to convert AudioBuffer to WAV Blob
function bufferToWav(abuffer) {
const numOfChan = abuffer.numberOfChannels;
const length = abuffer.length * numOfChan * 2;
const buffer = new ArrayBuffer(44 + length);
const view = new DataView(buffer);
const channels = [];
let sample;
let offset = 0;
let pos = 0;

// write WAVE header
setUint32(0x46464952);                         // "RIFF"
setUint32(36 + length);                        // file length - 8
setUint32(0x45564157);                         // "WAVE"

setUint32(0x20746d66);                         // "fmt " chunk
setUint32(16);                                 // length = 16
setUint16(1);                                  // PCM (uncompressed)
setUint16(numOfChan);
setUint32(abuffer.sampleRate);
setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
setUint16(numOfChan * 2);                      // block-align
setUint16(16);                                 // 16-bit (hardcoded in this demo)

setUint32(0x61746164);                         // "data" - chunk
setUint32(length);                             // chunk length

// write interleaved data
for(let i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

while(pos < abuffer.length) {
    for(let i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(44 + offset, sample, true); // write 16-bit sample
        offset += 2;
    }
    pos++;
}

// create Blob
return new Blob([buffer], {type: "audio/wav"});

function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
}

function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
}
}

// Function to get CSRF token from cookies
function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}


// Tab functionality
const tabButtons = document.querySelectorAll('[role="tab"]');
const tabPanels = document.querySelectorAll('[role="tabpanel"]');

tabButtons.forEach(button => {
button.addEventListener('click', () => {
const targetId = button.getAttribute('data-tabs-target');
const targetPanel = document.querySelector(targetId);

// Hide all panels and deselect all tabs
tabPanels.forEach(panel => panel.classList.add('hidden'));
tabButtons.forEach(btn => {
  btn.setAttribute('aria-selected', 'false');
  btn.classList.remove('bg-gray-100', 'dark:bg-gray-700');
  btn.classList.add('bg-gray-50', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');
});

// Show the target panel and select the clicked tab
targetPanel.classList.remove('hidden');
button.setAttribute('aria-selected', 'true');
button.classList.remove('bg-gray-50', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');
button.classList.add('bg-gray-100', 'dark:bg-gray-700');
});
});

// Show the first tab by default
document.querySelector('[role="tab"]').click();


function setupWeatherToggleAndTabs() {
const weatherToggleContainer = document.getElementById('weatherToggleContainer');
const weatherToggleLabel = document.getElementById('weatherToggleLabel');
const weatherToggleButton = document.getElementById('weatherToggleButton');
const weatherToggleCircle = document.getElementById('weatherToggleCircle');
const tabsCard = document.getElementById('tabsCard');
const tabButtons = document.querySelectorAll('[role="tab"]');
const tabPanels = document.querySelectorAll('[role="tabpanel"]');
let isToggled = false;
let isEnabled = false;

function disableWeatherToggle() {
    isEnabled = false;
    weatherToggleContainer.classList.add('cursor-not-allowed');
    weatherToggleContainer.classList.remove('hover:bg-blue-50');
    weatherToggleButton.classList.add('bg-gray-300');
    weatherToggleButton.classList.remove('cursor-pointer');
    weatherToggleLabel.classList.add('text-gray-500');
    weatherToggleLabel.classList.remove('text-gray-700');
    weatherToggleButton.removeEventListener('click', toggleWeather);
}

function enableWeatherToggle() {
    isEnabled = true;
    weatherToggleContainer.classList.remove('cursor-not-allowed');
    weatherToggleContainer.classList.add('hover:bg-blue-50');
    //weatherToggleButton.classList.remove('bg-gray-300');
    weatherToggleButton.classList.add('cursor-pointer');
    weatherToggleLabel.classList.remove('text-gray-500');
    weatherToggleLabel.classList.add('text-gray-700');
    weatherToggleButton.addEventListener('click', toggleWeather);
}

function toggleWeather() {
    if (!isEnabled) return;
    isToggled = !isToggled;
    if (isToggled) {
        weatherToggleButton.classList.remove('bg-gray-300');
        weatherToggleButton.classList.add('bg-blue-500');
        weatherToggleCircle.classList.add('translate-x-4');
        tabsCard.classList.remove('hidden');
        // Show the first tab by default when toggled on
        makePostRequestAndUpdateTab(0);
        tabButtons[0].click();
    } else {
        weatherToggleButton.classList.add('bg-gray-300');
        weatherToggleButton.classList.remove('bg-blue-500');
        weatherToggleCircle.classList.remove('translate-x-4');
        tabsCard.classList.add('hidden');
    }
}

// Tab functionality
tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tabs-target');
        const targetPanel = document.querySelector(targetId);
        const index = Array.from(tabButtons).indexOf(button);

        // Hide all panels and deselect all tabs
        tabPanels.forEach(panel => panel.classList.add('hidden'));
        tabButtons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.classList.remove('bg-gray-100', 'dark:bg-gray-700');
            btn.classList.add('bg-gray-50', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');
        });

        // Show the target panel and select the clicked tab
        targetPanel.classList.remove('hidden');
        button.setAttribute('aria-selected', 'true');
        button.classList.remove('bg-gray-50', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');
        button.classList.add('bg-gray-100', 'dark:bg-gray-700');

        // Make the POST request and update the tab content
        //makePostRequestAndUpdateTab(index);
    });
});

// Initially disable the weather toggle
disableWeatherToggle();

// Assign the enableWeatherToggle function to the global variable
globalEnableWeatherToggle = enableWeatherToggle;
}



// Make the POST request and update the tab content
function makePostRequestAndUpdateTab(tabIndex) {
let latlng_arr;

latlng_arr = latAndlng_for_weather(flag=false)
// console.log(`Array for weather ${latlng_arr}`)

const latitude = latlng_arr[0]; // Replace with the desired latitude
const longitude = latlng_arr[1]; // Replace with the desired longitude


fetch('get_weather_data/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken') // Assuming you're using Django's CSRF protection
    },
    body: new URLSearchParams({
        latitude: latitude,
        longitude: longitude
    })
})
.then(response => response.json())
.then(data => {
    // console.log(data)
    // Update the tab content with the received data
    //if (tabIndex === 0) {
        // Update the "General" tab
        updateGeneralTab(data);
    //} else if (tabIndex === 1) {
        // Update the "Hourly" tab
        updateHourlyTab(data);
    //} else if (tabIndex === 2) {
        // Update the "Daily" tab
        updateDailyTab(data);
    //}
})
.catch(error => {
    console.error('Error:', error);
});
}

// Helper function to get CSRF token from cookie
function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}

function formatDateTime(dateTimeString) {
// Parse the input string into a Date object
const dateTime = new Date(dateTimeString);

// Get the hour in 12-hour format
let hour = dateTime.getHours();
const ampm = hour >= 12 ? 'PM' : 'AM';
hour = hour % 12 || 12;

// Get the minutes and seconds
const minutes = dateTime.getMinutes().toString().padStart(2, '0');
const seconds = dateTime.getSeconds().toString().padStart(2, '0');

// Get the date
const year = dateTime.getFullYear();
const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
const day = dateTime.getDate().toString().padStart(2, '0');

// Return the date and time in the desired format
return {
date: `${year}-${month}-${day}`,
time: `${hour}:${minutes}:${seconds} ${ampm}`
};
}

function updateGeneralTab(data) {
// Update the "General" tab content
const Img = document.querySelector("#stats")
const elevationElement = document.querySelector('#p1');
const timezoneElement = document.querySelector('#p2');
const timeElement = document.querySelector('#p3');
const dateElement = document.querySelector('#p4');
const dayImg = document.querySelector("#g-img-day");
const nightImg = document.querySelector("#g-img-night");
const location_night = document.querySelector("#loc-night");
const location_day = document.querySelector("#loc-day");

const dateTimeString = data.current.time;
const { date, time } = formatDateTime(dateTimeString);

elevationElement.innerHTML = `<strong>Elevation:</strong> ${data.location.elevation} m asl`;
timezoneElement.innerHTML = `<strong>Timezone:</strong> ${data.location.timezone} ${data.location.timezone_abbreviation}`;
timeElement.innerHTML = `<strong>Time:</strong> ${time}`;
dateElement.innerHTML = `<strong>Date:</strong> ${date}`;
// data.current.is_day
if(data.current.is_day == 1){
    nightImg.classList.add('hidden');
    dayImg.classList.remove('hidden')
    location_day.innerHTML = `${data.location.location}`
}else if(data.current.is_day == 0){
    location_night.innerHTML = `${data.location.location}`
    nightImg.classList.remove('hidden');
    dayImg.classList.add('hidden');
}

}

function formatHourlyWeatherData(data) {
const formattedData = {
    date: new Date(data.local_time).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    time: new Date(data.local_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }),
    rain: data.rain > 0 ? `${data.rain} mm` : "No rain",
    humidity: `${data.relative_humidity_2m}%`,
    temperature: `${data.temperature_2m.toFixed(1)}°C`,
    visibility: `${(data.visibility / 1000).toFixed(1)} km`,
    weatherCode: data.weather_code,
    weatherDescription: data.weather_description
};

return formattedData;
}

function updateHourlyTab(data) {
let rawHourlyData = data.hourly[0]

let formattedHourlyData = formatHourlyWeatherData(rawHourlyData);

const dateElement = document.querySelector('#x1');
const timeElement = document.querySelector('#x2');
const temperatureElement = document.querySelector('#x3');
const weatherElement = document.querySelector('#x4');
const humidityElement = document.querySelector('#x5');
const visibilityElement = document.querySelector('#x6');
const rainElement = document.querySelector('#x7');

dateElement.innerHTML = `<strong>Date:</strong> ${formattedHourlyData.date}`;
timeElement.innerHTML = `<strong>Time:</strong> ${formattedHourlyData.time}`;
temperatureElement.innerHTML = `<strong>Temperature:</strong> ${formattedHourlyData.temperature}`;
weatherElement.innerHTML = `<strong>Weather:</strong> ${formattedHourlyData.weatherDescription}`;
humidityElement.innerHTML = `<strong>Humidity:</strong> ${formattedHourlyData.humidity}`;
visibilityElement.innerHTML = `<strong>Visibility:</strong> ${formattedHourlyData.visibility}`;
rainElement.innerHTML = `<strong>Rain:</strong> ${formattedHourlyData.rain}`;
}
function formatDailyWeatherData(data) {
const formattedData = {
    date: new Date(data.local_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    time: new Date(data.local_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }),
    daylightDuration: (data.daylight_duration / 3600).toFixed(2) + " hours",
    sunshineDuration: (data.sunshine_duration / 3600).toFixed(2) + " hours",
    uvIndexMax: data.uv_index_max.toFixed(1),
    sunrise: data.sunrise ? new Date(data.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : "Not available",
    sunset: data.sunset ? new Date(data.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : "Not available"
};

return formattedData;
}

function updateDailyTab(data) {
let rawDailyData = data.daily[0];

let formattedDailyData = formatDailyWeatherData(rawDailyData);

const dateElement = document.querySelector('#y1');
const timeElement = document.querySelector('#y2');
const dayLightElement = document.querySelector('#y3');
const sunShineElement = document.querySelector('#y4');
const UVElement = document.querySelector('#y5');
const sunRiseElement = document.querySelector('#y6');
const sunSetElement = document.querySelector('#y7');


dateElement.innerHTML = `<strong>Date:</strong> ${formattedDailyData.date}`;
timeElement.innerHTML = `<strong>Time:</strong> ${formattedDailyData.time}`;
dayLightElement.innerHTML = `<strong>Daylight Duration:</strong> ${formattedDailyData.daylightDuration}`;
sunShineElement.innerHTML = `<strong>Sunshine Duration:</strong> ${formattedDailyData.sunshineDuration}`;
UVElement.innerHTML = `<strong>UV Index (Max):</strong> ${formattedDailyData.uvIndexMax}`;
sunRiseElement.innerHTML = `<strong>Sunrise:</strong> ${formattedDailyData.sunrise}`;
sunSetElement.innerHTML = `<strong>Sunset:</strong> ${formattedDailyData.sunset}`;
}



// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupWeatherToggleAndTabs);


// ******************************************************************************************

function categoryManager() {
return {
    categories: [],
    activeDropdown: null,
    showCategoryModal: false,
    showLocationModal: false,
    newCategoryName: '',
    newLocationName: '',
    selectedCategoryId: null,
    hideDropdownTimeout: null,
    init() {
        this.fetchCategories();
    },

    async deleteCategory(categoryId) {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/delete_category/${categoryId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            this.categories = this.categories.filter(c => c.id !== categoryId);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    },

    async deleteLocation(categoryId, locationId) {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            const response = await fetch(`/delete_location/${locationId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete location');
            }

            const category = this.categories.find(c => c.id === categoryId);
            if (category) {
                category.locations = category.locations.filter(l => l.id !== locationId);
            }
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    },

    async createCategory() {
        const response = await fetch('/create_category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ name: this.newCategoryName })
        });
        const data = await response.json();
        if (data.success) {
            this.categories.push({id: data.category_id, name: data.category_name, locations: []});
            this.newCategoryName = '';
            this.showCategoryModal = false;
        } else {
            alert('Error creating category: ' + JSON.stringify(data.errors));
        }
    },

    async fetchCategories() {
        try {
            const response = await fetch('/api/categories/');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            this.categories = await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },

    handleMouseEnter(categoryId) {
        clearTimeout(this.hideDropdownTimeout);
        this.activeDropdown = categoryId;
    },

    handleMouseLeave(categoryId) {
        this.hideDropdownTimeout = setTimeout(() => {
        this.activeDropdown = null;
        }, 500);
    },

    showAddLocationModal(categoryId) {
        this.selectedCategoryId = categoryId;
        this.showLocationModal = true;
    },

    async addLocation() {
        if (!this.newLocationName.trim() || !this.selectedCategoryId) return;

        try {
            const response = await fetch(`/add_location/${this.selectedCategoryId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken(),
                },
                body: JSON.stringify({ name: this.newLocationName }),
            });

            if (!response.ok) {
                throw new Error('Failed to add location');
            }

            const newLocation = await response.json();
            
            // Find the category and add the new location
            const category = this.categories.find(c => c.id === this.selectedCategoryId);
            if (category) {
                category.locations.push(newLocation);
            }

            this.newLocationName = '';
            this.showLocationModal = false;
        } catch (error) {
            console.error('Error adding location:', error);
        }
    },


    getCsrfToken() {
        // Implement this method to return the CSRF token from your Django template
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
};
}
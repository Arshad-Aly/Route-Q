# RouteQ

**Your voice is the new compass**

## Introduction
This project is a voice-activated interactive web application that allows users to interact with maps using their voice. Users can explore and navigate maps hands-free, making it a convenient and intuitive experience.

## Features
- Voice-activated interaction with maps
- Hands-free navigation and exploration
- Seamless integration of speech-to-text technology
- Responsive and user-friendly interface
- **Implemented a Caching Mechanism to Save the API calls and provide a Fast User Experience**

## Tech Stack

* **Backend:** Django
* **Frontend:** Leaflet, HTML, Tailwind CSS
* **Database:** Neon DB
* **Machine models:** Vosk, NLP

## Installation

### Prerequisites

- Python version 3.10.x or higher
-  pip (package installer for Python).
- Node.js and npm (package manager for Node.js) - for Tailwind

### Setup
1. **Clone the repository:**
   
    ```bash
    git clone https://github.com/Arshad-Aly/Route-Q.git

2. **Create a virtual environment (recommended):**

     ```bash
     python -m venv venv
     venv\Scripts\activate  # Mac: source venv/bin/activate

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt

4. **Download the VOSK speech-to-text model:**
    - Download the "vosk-model-en-in-0.5" model from the [VOSK website](https://alphacephei.com/vosk/models).
    - Place the downloaded model in the `models` folder of your project.

5. **Create a `.env` file outside the root directory and add the following environment variables:**
    - `DATABASE_URL`: Obtain this connection string from the Neon DB Postgres database you created.
    - `DJANGO_SECRET_KEY`: Generate a secret key using the `secrets` module in Python:
  
      ```python
      import secrets
      key = secrets.token_urlsafe(32)
      print(key)
      ```
    - `OPENROUTE_API_KEY`: Obtain this key from the [OpenRouteService website](https://openrouteservice.org/).

6. **Run the Django migrations:**
   
    ```bash
     python manage.py migrate

## Usage

### Running the Application

1. Start the development server:

    ```bash
     python manage.py runserver

2. The application should now be running at `http://127.0.0.1:8000/`.

### Interacting with the Maps

  1. On the web application, click the microphone icon to enable voice-activated interaction.
  2. Speak your commands to explore and navigate the maps.
  3. The application will interpret your voice commands and update the map accordingly.

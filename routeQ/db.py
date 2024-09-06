# Add these at the top of your settings.py
from os import getenv
# from dotenv import load_dotenv
from routeQ.env import config
import dj_database_url

# Replace the DATABASES section of your settings.py with this
DATABASE_URL = config("DATABASE_URL", default=None)
if DATABASE_URL is not None:
    DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True
    )
    }

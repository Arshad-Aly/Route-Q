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

# PGHOST='ep-yellow-flower-a1bfypfr.ap-southeast-1.aws.neon.tech'
# PGDATABASE='neondb'
# PGUSER='neondb_owner'
# PGPASSWORD='tPm93BsEzSfd'

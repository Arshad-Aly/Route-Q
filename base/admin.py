from django.contrib import admin
from .models import Location, Category, LocationCategory, SearchCache

# Register your models here.
admin.site.register(Location)
admin.site.register(Category)
admin.site.register(LocationCategory)
admin.site.register(SearchCache)

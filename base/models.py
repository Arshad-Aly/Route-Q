from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import F
from django.db.models.functions import Lower


class Location(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower('name'),
                'latitude',
                'longitude',
                name='unique_location'
            )
        ]
        indexes = [
            models.Index(Lower('name'), 'latitude', 'longitude', name='location_search_idx'),
        ]

    @classmethod
    def get_or_create(cls, name, latitude, longitude):
        try:
            location = cls.objects.get(name__iexact=name)
            if location.latitude is not None and location.longitude is not None:
                return location, False
            else:
                return None, True
        except cls.DoesNotExist:
            return None, True
        
    def save(self, *args, **kwargs):
        if self.latitude is not None:
            self.latitude = round(self.latitude, 6)
        if self.longitude is not None:
            self.longitude = round(self.longitude, 6)
        super().save(*args, **kwargs)
    

class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    locations = models.ManyToManyField(Location, through='LocationCategory')
    
    def __str__(self):
        return f"{self.name} (User: {self.user.username})"
    
    class Meta:
        unique_together = ('name', 'user')

class LocationCategory(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = ('location', 'category', 'user')

class SearchCache(models.Model):
    search_query = models.CharField(max_length=255, unique=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.search_query} -> {self.location.name}" 
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('route/', views.get_route, name='get_route'),
    path('get_route_data/', views.get_route_data, name='get_route_data'),
    path('get_weather_data/', views.process_weather, name='get_weather_data'),
    path('transcribe/', views.transcribe_audio),
    path('transcribe_command/', views.transcribe_command),
    # path('debug/', views.debug_view, name='debug'),
    # path('test/', views.testing, name='test'),

    path('create_category/', views.create_category, name="create_category"),
    path('delete_category/<int:category_id>/', views.delete_category, name='delete_category'),
    path('delete_location/<int:location_id>/', views.delete_location, name='delete_location'),

    path('api/categories/', views.fetch_categories, name='fetch_categories'),
    path('add_location/<int:category_id>/', views.add_location, name='add_location'),

    path('login/', views.login_view, name="login"),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name="logout"),

    path('docs/', views.doc, name="docs")
    # path('contact/', views.contact, name="contact"),
]

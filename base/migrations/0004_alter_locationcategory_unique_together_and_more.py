# Generated by Django 5.0.7 on 2024-08-27 15:59

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_category_locationcategory'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='locationcategory',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='category',
            name='locations',
            field=models.ManyToManyField(through='base.LocationCategory', to='base.location'),
        ),
        migrations.AddField(
            model_name='location',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='location',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='locationcategory',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='location',
            unique_together={('name', 'latitude', 'longitude')},
        ),
        migrations.AlterUniqueTogether(
            name='locationcategory',
            unique_together={('location', 'category', 'user')},
        ),
        migrations.CreateModel(
            name='SearchCache',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('search_query', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.location')),
            ],
        ),
    ]

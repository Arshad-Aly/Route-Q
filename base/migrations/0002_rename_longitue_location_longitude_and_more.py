# Generated by Django 5.0.7 on 2024-08-26 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='location',
            old_name='longitue',
            new_name='longitude',
        ),
        migrations.AlterField(
            model_name='location',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]

# Generated by Django 5.1.5 on 2025-01-24 21:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_zone_garbagereport_zone_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='garbagereport',
            name='zone_name',
        ),
    ]

# Generated by Django 5.1.5 on 2025-01-24 16:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_garbagereport_description_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='garbagereport',
            name='user',
        ),
    ]

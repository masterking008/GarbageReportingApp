from django.db import models
from django.contrib.auth.models import User
import uuid
from django.db.models import Max

# models.py
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('reporter', 'Reporter'),
        ('resolver', 'Resolver'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='reporter')
    zone = models.ForeignKey('Zone', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username

class Zone(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, default='IITB')  # Name is required
    coordinates = models.JSONField(blank=True, null=True)  # Coordinates are optional

    def __str__(self):
        return self.name


class GarbageReport(models.Model):
    STAGES = [
        ('Reported', 'Reported'),
        ('Work Started', 'Work Started'),
        ('Resolved', 'Resolved'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='garbage_reports/', null=True, blank=True)
    resolved_image = models.ImageField(upload_to='garbage_reports/resolved', null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    resolved_coordinates = models.JSONField(null=True, blank=True)  # Store latitude and longitude as an array [latitude, longitude]
    coordinates = models.JSONField(null=True, blank=True)  # Store latitude and longitude as an array [latitude, longitude]
    zone_name = models.CharField(max_length=255, blank=True, null=True)  # Zone can be null or blank
    ticket_id = models.CharField(max_length=20, unique=True, default="", null=True, blank=True)
    stage = models.CharField(max_length=20, choices=STAGES, default='Reported', null=True, blank=True)
    reported_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    case_number = models.PositiveIntegerField(null=True, blank=True)  # New field for case number

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            self.ticket_id = str(uuid.uuid4())[:8]  # Generate a random 8-character ticket ID
        
        if self.user and self.case_number is None:
            # Retrieve the highest case number for the user and increment it by 1
            last_case = GarbageReport.objects.filter(user=self.user).aggregate(max_case=Max('case_number'))
            last_case_number = last_case['max_case'] if last_case['max_case'] is not None else 0
            self.case_number = last_case_number + 1  # Increment by 1 for the new case

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Report {self.ticket_id or 'Unknown'} (Case #{self.case_number}) by {self.user.username if self.user else 'Anonymous'} at {self.reported_at or 'Unknown'}"

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Zone, GarbageReport

# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

# Serializer for the Zone model
class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name', 'coordinates']  # Include necessary fields

class ProfileSerializer(serializers.ModelSerializer):
    zone = serializers.StringRelatedField()

    class Meta:
        model = Profile
        fields = ('role','zone')

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user
    


class GarbageReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageReport
        fields = '__all__'
        read_only_fields = ('user', 'reported_at', 'ticket_id', 'case_number')  # Ensures user and case_number cannot be changed by clients

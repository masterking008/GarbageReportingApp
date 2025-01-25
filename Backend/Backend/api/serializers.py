from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Zone, GarbageReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer for the Zone model
class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name', 'coordinates']  # Include necessary fields


class GarbageReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageReport
        fields = '__all__'
        read_only_fields = ('user', 'reported_at', 'ticket_id', 'case_number')  # Ensures user and case_number cannot be changed by clients

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    GarbageReportViewSet,
    login,
    verify_otp,
    send_otp,
    get_zones)

router = DefaultRouter()
router.register('reports', GarbageReportViewSet, basename='garbage-reports')

urlpatterns = [
    path('zones/', get_zones, name='get_zones'),
    path('login/', login, name='login'),
    path('send-otp/', send_otp, name='send-otp'),
    path('verify-otp/', verify_otp, name='verify-otp'),
]

urlpatterns += router.urls
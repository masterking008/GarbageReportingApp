from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import GarbageReportViewSet, send_otp, verify_otp, login , get_zones , start_work , update_case 
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'reports', GarbageReportViewSet)

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/send-otp/', send_otp),
    path('api/verify-otp/', verify_otp),
    path('api/login/', login),
    path('api/zones/', get_zones, name='get_zones'),
    path('api/start-work', start_work, name='start-work'),
    path('api/update-case', update_case, name='update_case'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
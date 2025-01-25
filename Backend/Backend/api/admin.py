from django.contrib import admin
from .models import GarbageReport , Zone , Profile , User


# admin.site.register(Zone)
admin.site.register(Zone,)

# class GarbageReportAdmin(admin.ModelAdmin):
#     # Fields to display in the list view
#     list_display = ('ticket_id', 'user', 'stage', 'reported_at', 'description', 'coordinates')
    
#     # Make ticket_id, user, and stage searchable
#     search_fields = ('ticket_id', 'user__username', 'stage')

#     # Filter reports by stage
#     list_filter = ('stage',)

#     # Optionally, add inline editing for specific fields
#     list_editable = ('stage',)

#     # Fields to display on the detail page
#     fieldsets = (
#         (None, {
#             'fields': ('ticket_id', 'user', 'description', 'coordinates', 'image', 'stage')
#         }),
#         ('Timestamp', {
#             'fields': ('reported_at',),
#             'classes': ('collapse',)
#         }),
#     )

#     # Add the option to filter by stage in the admin view
#     ordering = ('-reported_at',)

# admin.site.register(GarbageReport, GarbageReportAdmin)


admin.site.register(GarbageReport,)
admin.site.register(Profile,) 
# admin.site.register(User,)
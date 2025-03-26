from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id', 'name', 'email', 'is_active', 'is_staff')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)

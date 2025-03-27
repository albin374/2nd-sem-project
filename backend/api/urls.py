from django.urls import path
from .views import send_otp, verify_otp, register_user, login_user

urlpatterns = [
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
]

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
import random
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User

# Store OTP temporarily
otp_storage = {}


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email').lower()  # Normalize email
            password = data.get('password')

            # Authenticate using email (since it's USERNAME_FIELD)
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful!',
                    'user_id': user.id
                })
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password'
            }, status=401)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Server error: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST requests allowed'
    }, status=405)


@api_view(['POST'])
@csrf_exempt
def register_user(request):
    try:
        # Get data from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # Validate required fields
        if not all([username, email, password, confirm_password]):
            return Response(
                {'success': False, 'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != confirm_password:
            return Response(
                {'success': False, 'error': 'Passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for existing user
        if User.objects.filter(username=username).exists():
            return Response({'success': False, 'error': 'Username already exists'},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'success': False, 'error': 'Email already registered'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return Response({'success': True, 'message': 'User registered successfully', 'user_id': user.id},
                        status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'success': False, 'error': 'Registration failed', 'detail': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@csrf_exempt
def send_otp(request):
    email = request.data.get('email')
    username = request.data.get('username')

    if not email or not username:
        return Response({'success': False, 'error': 'Email and username are required'},
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'success': False, 'error': 'Email already registered'},
                        status=status.HTTP_400_BAD_REQUEST)

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = otp

    try:
        send_mail(
            'Your OTP Code',
            f'Your OTP for registration is: {otp}',
            'alosiousalbin90@gmail.com',
            [email],
            fail_silently=False,
        )
        return Response({'success': True, 'message': 'OTP sent successfully!', 'otp': otp if settings.DEBUG else None})
    except Exception as e:
        return Response({'success': False, 'error': f'Failed to send email: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@csrf_exempt
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')
    username = request.data.get('username')

    if not all([email, otp, password, confirm_password, username]):
        return Response({'success': False, 'error': 'All fields are required'},
                        status=status.HTTP_400_BAD_REQUEST)

    if otp_storage.get(email) != otp:
        return Response({'success': False, 'error': 'Invalid OTP'},
                        status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({'success': False, 'error': 'Passwords do not match'},
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'success': False, 'error': 'Username already exists'},
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'success': False, 'error': 'Email already registered'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        del otp_storage[email]
        return Response({'success': True, 'message': 'User registered successfully!'},
                        status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'success': False, 'error': f'Registration failed: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
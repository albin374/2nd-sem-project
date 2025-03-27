from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Use email as the username field for authentication
    USERNAME_FIELD = 'email'
    # Required fields for createsuperuser command
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
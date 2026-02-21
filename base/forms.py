from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from .models import Room , User
from django import forms
from django.contrib.auth import get_user_model

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class RoomForm(ModelForm):
    class Meta:
        model = Room
        fields = '__all__'
        exclude = ['host', 'participants']


class UpdateForm(ModelForm):
    class Meta:
        model = User
        fields = ['avatar', 'name', 'username' , 'email' ,'bio' ]
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout

from .models import Room, Topic, Message, User
from .forms import RoomForm, UpdateForm, CustomUserCreationForm

# -----------------------------
# AUTHENTICATION VIEWS
# -----------------------------

def loginpage(request):
    page = 'login'
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username', '').lower()
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'base/login_register.html', {'page': page})


def logoutUser(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('home')


def registerUser(request):
    page = 'register'
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            messages.success(request, "Account created successfully!")
            return redirect('home')
        else:
            messages.error(request, f"Registration error: {form.errors}")

    return render(request, 'base/login_register.html', {'form': form, 'page': page})


# -----------------------------
# CORE VIEWS
# -----------------------------

def home(request):
    q = request.GET.get('q', '')
    rooms = Room.objects.filter(
        Q(topic__name__icontains=q) |
        Q(name__icontains=q) |
        Q(description__icontains=q)
    )
    topics = Topic.objects.all()[:5]
    room_count = rooms.count()
    room_messages = Message.objects.filter(
        Q(room__topic__name__icontains=q)
    ).select_related('room', 'user')

    context = {
        'rooms': rooms,
        'topics': topics,
        'room_count': room_count,
        'room_messages': room_messages
    }
    return render(request, 'base/home.html', context)


def room(request, pk):
    room = get_object_or_404(Room, id=pk)
    room_messages = room.message_set.all().select_related('user')
    participants = room.participants.all()

    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, "You must be logged in to send messages.")
            return redirect('login')
        body = request.POST.get('body')
        if body:
            Message.objects.create(user=request.user, room=room, body=body)
            room.participants.add(request.user)
            messages.success(request, "Message sent successfully!")
        return redirect('room', pk=room.id)

    context = {
        'room': room,
        'room_messages': room_messages,
        'participants': participants
    }
    return render(request, 'base/room.html', context)


def userProfile(request, pk):
    user = get_object_or_404(User, id=pk)
    rooms = user.room_set.all()
    room_messages = user.message_set.all()
    topics = Topic.objects.all()

    context = {
        'user': user,
        'rooms': rooms,
        'room_messages': room_messages,
        'topics': topics
    }
    return render(request, 'base/profile.html', context)


# -----------------------------
# ROOM MANAGEMENT
# -----------------------------

@login_required(login_url='login')
def createRoom(request):
    form = RoomForm()
    topics = Topic.objects.all()

    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, _ = Topic.objects.get_or_create(name=topic_name)

        Room.objects.create(
            host=request.user,
            topic=topic,
            name=request.POST.get('name'),
            description=request.POST.get('description')
        )
        messages.success(request, "Room created successfully!")
        return redirect('home')

    return render(request, 'base/room_form.html', {'form': form, 'topics': topics})


@login_required(login_url='login')
def updateRoom(request, pk):
    room = get_object_or_404(Room, id=pk)

    if request.user != room.host:
        messages.error(request, "You are not allowed to update this room!")
        return redirect('home')

    form = RoomForm(instance=room)
    topics = Topic.objects.all()

    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, _ = Topic.objects.get_or_create(name=topic_name)
        room.name = request.POST.get('name')
        room.topic = topic
        room.description = request.POST.get('description')
        room.save()
        messages.success(request, "Room updated successfully!")
        return redirect('home')

    return render(request, 'base/room_form.html', {'form': form, 'topics': topics})


@login_required(login_url='login')
def deleteRoom(request, pk):
    room = get_object_or_404(Room, id=pk)

    if request.user != room.host:
        messages.error(request, "You are not allowed to delete this room!")
        return redirect('home')

    if request.method == 'POST':
        room.delete()
        messages.success(request, "Room deleted successfully!")
        return redirect('home')

    return render(request, 'base/delete.html', {'obj': room})


@login_required(login_url='login')
def deleteMessage(request, pk):
    message = get_object_or_404(Message, id=pk)

    if request.user != message.user:
        messages.error(request, "You are not allowed to delete this message!")
        return redirect('home')

    if request.method == 'POST':
        message.delete()
        messages.success(request, "Message deleted successfully!")
        return redirect('home')

    return render(request, 'base/delete.html', {'obj': message})


# -----------------------------
# USER UPDATE
# -----------------------------

@login_required(login_url='login')
def Updateuser(request):
    user = request.user
    form = UpdateForm(instance=user)

    if request.method == 'POST':
        form = UpdateForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect('user-profile', pk=user.id)

    return render(request, 'base/update-user.html', {'form': form})


# -----------------------------
# EXTRA PAGES
# -----------------------------

def topicsPage(request):
    q = request.GET.get('q', '')
    topics = Topic.objects.filter(name__icontains=q)
    return render(request, 'base/topics.html', {'topics': topics})


def activityPage(request):
    room_messages = Message.objects.select_related('room', 'user').all()
    return render(request, 'base/activity.html', {'room_messages': room_messages})
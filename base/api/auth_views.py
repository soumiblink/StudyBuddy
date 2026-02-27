"""
Authentication views for password reset and email verification
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

User = get_user_model()


class PasswordResetRateThrottle(AnonRateThrottle):
    rate = '3/hour'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetRateThrottle])
def request_password_reset(request):
    """
    Request password reset email
    POST: { "email": "user@example.com" }
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        # Send email
        subject = 'Password Reset Request - StudyBud'
        message = f"""
        Hi {user.username},
        
        You requested a password reset for your StudyBud account.
        
        Click the link below to reset your password:
        {reset_link}
        
        This link will expire in 24 hours.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        StudyBud Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset email sent. Please check your inbox.'
        })
        
    except User.DoesNotExist:
        # Don't reveal if user exists or not (security)
        return Response({
            'message': 'If an account exists with this email, a password reset link has been sent.'
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    """
    Confirm password reset with token
    POST: {
        "uid": "encoded_user_id",
        "token": "reset_token",
        "new_password": "newpassword123"
    }
    """
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uid, token, new_password]):
        return Response(
            {'error': 'All fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Invalid or expired reset link'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password reset successful. You can now login with your new password.'
        })
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {'error': 'Invalid reset link'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """
    Resend email verification
    POST: { "email": "user@example.com" }
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        if user.is_active:
            return Response({
                'message': 'Email is already verified'
            })
        
        # Generate verification token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create verification link
        verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
        
        # Send email
        subject = 'Verify Your Email - StudyBud'
        message = f"""
        Hi {user.username},
        
        Welcome to StudyBud! Please verify your email address to activate your account.
        
        Click the link below to verify:
        {verification_link}
        
        This link will expire in 24 hours.
        
        Best regards,
        StudyBud Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Verification email sent. Please check your inbox.'
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """
    Verify email with token
    POST: {
        "uid": "encoded_user_id",
        "token": "verification_token"
    }
    """
    uid = request.data.get('uid')
    token = request.data.get('token')
    
    if not all([uid, token]):
        return Response(
            {'error': 'UID and token are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Invalid or expired verification link'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Activate user
        user.is_active = True
        user.save()
        
        return Response({
            'message': 'Email verified successfully. You can now login.'
        })
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {'error': 'Invalid verification link'},
            status=status.HTTP_400_BAD_REQUEST
        )

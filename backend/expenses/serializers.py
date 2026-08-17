from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializes Expense model to/from JSON.
    - owner is read-only and automatically set from request.user in the view.
    - owner_username is a read-only display field.
    """
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Expense
        fields = [
            'id',
            'amount',
            'category',
            'description',
            'date',
            'owner_username',
            'created_at',
        ]
        read_only_fields = ['id', 'owner_username', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value


from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate_username(self, value):
        username = value.strip()
        if ' ' in username:
            raise serializers.ValidationError("Username cannot contain spaces. Use letters, numbers, or underscores (e.g. JoyKK or Joy_KK).")
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("This username is already taken. Please choose a different one.")
        return username


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


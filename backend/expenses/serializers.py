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

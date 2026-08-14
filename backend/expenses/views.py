from django.db.models import Sum
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Expense resource.

    All operations are scoped to request.user — users NEVER see each other's data.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only expenses belonging to the logged-in user."""
        return Expense.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the owner to the logged-in user on creation."""
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """Ensure owner cannot be changed on update."""
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='monthly-total')
    def monthly_total(self, request):
        """
        GET /api/expenses/monthly-total/

        Returns the sum of the current user's expenses in the current calendar month.
        """
        now = timezone.localdate()  # Uses TIME_ZONE from settings (Asia/Kolkata)
        current_year = now.year
        current_month = now.month

        total = (
            Expense.objects
            .filter(
                owner=request.user,
                date__year=current_year,
                date__month=current_month,
            )
            .aggregate(total=Sum('amount'))['total']
        )

        total = total or 0

        month_name = now.strftime('%B %Y')  # e.g. "August 2026"

        return Response({
            'month': month_name,
            'total': str(total),
            'year': current_year,
            'month_number': current_month,
        })

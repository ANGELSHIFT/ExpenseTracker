from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['owner', 'amount', 'category', 'date', 'description']
    list_filter = ['category', 'date', 'owner']
    search_fields = ['description', 'owner__username']
    ordering = ['-date']

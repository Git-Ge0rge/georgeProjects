from django.db import models
from django.db.models import Sum

class Widget(models.Model):
    description = models.CharField(max_length=200)
    quantity = models.IntegerField(default=0)
    

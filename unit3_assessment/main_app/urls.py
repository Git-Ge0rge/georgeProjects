from django.urls import path

from . import views

urlpatterns = [
    path('', views.AddWidget.as_view(), name='add_widget'),
    path('<int:widget_id>/delete/', views.widget_delete, name='widget_delete'),
]
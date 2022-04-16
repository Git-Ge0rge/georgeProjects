from django.shortcuts import render
from django.shortcuts import render, redirect
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic import ListView, DetailView
from django.contrib.auth import login
from .models import Widget
from django.db.models import Sum

class AddWidget(CreateView):
    model = Widget
    fields = '__all__'
    success_url = '/'
    
    #https://stackoverflow.com/questions/9338181/django-mixing-listview-and-createview
    def get_context_data(self, **kwargs):
        kwargs['Widget_list'] = Widget.objects.order_by('id')
        kwargs['sum'] = Widget.objects.aggregate(Sum('quantity'))['quantity__sum']
        return super(AddWidget, self).get_context_data(**kwargs)
    

#Delete Widget 
def widget_delete(request, widget_id):
    widget = Widget.objects.get(pk=widget_id)
    print(widget)
    widget.delete()
    return redirect('add_widget')
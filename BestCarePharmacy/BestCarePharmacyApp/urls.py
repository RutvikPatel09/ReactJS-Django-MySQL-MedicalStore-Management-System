"""BestCarePharmacy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from . import views
from .middlewares.auth import auth_middleware
from .views import Index, signup, Login, logout, Cart, CheckOut, OrdersView, search, consultdoctor

urlpatterns = [
   path('', Index.as_view(), name='homepage'),
   path('signup',signup),
   path('login',Login.as_view(),name='login'),
   path('logout',logout,name='logout'),
   path('cart',Cart.as_view(),name='cart'),
   path('checkout',auth_middleware(CheckOut.as_view()),name='checkout'),
   path('orders', auth_middleware(OrdersView.as_view()), name='orders'),
   path('search', search, name='search'),
   path('consultdoctor', consultdoctor, name='consultdoctor')
]

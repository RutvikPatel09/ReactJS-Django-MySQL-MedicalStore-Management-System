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
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from BestCarePharmacy import settings
from BestCarePharmacyApp import views
from BestCarePharmacyApp.views import CompanyNameViewSet, CompanyOnlyViewSet, MedicineByNameViewSet, \
    GenerateBillViewSet, CustomerRequestViewSet, MedicineOnlyViewSet, OrdersListViewSet

router = routers.DefaultRouter()
router.register("company", views.CompanyViewSet, basename="company")
router.register("companybank", views.CompanyBankViewSet, basename="companybank")
router.register("medicine", views.MedicineViewSet, basename="medicine")
router.register("companyaccount", views.CompanyAccountViewSet, basename="companyaccount")
router.register("generate_bill_api", views.GenerateBillViewSet, basename="generate_bill_api")
router.register("customer_request", views.CustomerRequestViewSet, basename="customer_request")
router.register("employee", views.EmployeeViewSet, basename="employee")
router.register("home_api", views.HomeApiViewSet, basename="home_api")
router.register("doctor", views.DoctorViewSet, basename="doctor")
router.register("orders", views.OrdersViewSet, basename="orders")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('BestCarePharmacyApp.urls')),
    path('api/', include(router.urls)),
    path('api/gettoken/', TokenObtainPairView.as_view(), name="gettoken"),
    path('api/refresh_token/', TokenRefreshView.as_view(), name="refresh_token"),
    path('api/companybyname/<str:name>', CompanyNameViewSet.as_view(), name="companybyname"),
    path('api/medicinebyname/<str:name>', MedicineByNameViewSet.as_view(), name="medicinebyname"),
    path('api/companyonly/', CompanyOnlyViewSet.as_view(), name="companyonly"),
    path('api/OrdersList/', OrdersListViewSet.as_view(), name="OrdersList")
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin

# Register your models here.
from BestCarePharmacyApp.models import Company, Medicine, MedicalDetails, Employee, Customer, Bill, BillDetails, \
    CustomerRequest, CompanyAccount, CompanyBank, EmployeeSalary, EmployeeBank, Users, Doctor, Orders

admin.site.register(Company)
admin.site.register(Medicine)
admin.site.register(MedicalDetails)
admin.site.register(Employee)
admin.site.register(Customer)
admin.site.register(Bill)
admin.site.register(EmployeeSalary)
admin.site.register(BillDetails)
admin.site.register(CustomerRequest)
admin.site.register(CompanyAccount)
admin.site.register(CompanyBank)
admin.site.register(EmployeeBank)
admin.site.register(Users)
admin.site.register(Doctor)
admin.site.register(Orders)


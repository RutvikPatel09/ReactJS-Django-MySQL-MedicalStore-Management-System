from rest_framework import serializers

from BestCarePharmacyApp.models import Company, CompanyBank, Medicine, MedicalDetails, Employee, Customer, Bill, \
    CustomerRequest, CompanyAccount, EmployeeBank, BillDetails, Doctor, Orders


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class CompanyBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBank
        fields = "__all__"

    #def to_representation(self, instance):
     #   response = super().to_representation(instance)
      #  response['company'] = CompanySerializer(instance.company_id).data
       # return response


class MedicineSerializer(serializers.ModelSerializer):

    #medicine_id = OrdersRequestSerializer(read_only=True,many=True)
    class Meta:
        model = Medicine
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['company'] = CompanySerializer(instance.company_id).data
        return response


class OrdersRequestSerializer(serializers.ModelSerializer):

    #medicine = MedicineSerializer(read_only=True)

    #print(medicine)
    class Meta:
        model = Orders
        fields = "__all__"


class MedicalDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDetails
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['Medicine'] = MedicineSerializer(instance.medicine_id).data
        return response


class MedicalDetailsSerializerSimple(serializers.ModelSerializer):
    class Meta:
        model = MedicalDetails
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class CustomerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRequest
        fields = "__all__"


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['Customer'] = CustomerSerializer(instance.customer_id).data
        return response


class BillDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillDetails
        fields = "__all__"


class CustomerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRequest
        fields = "__all__"



class CompanyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAccount
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['Company'] = CompanySerializer(instance.company_id).data
        return response


class EmployeeBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeBank
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['Employee'] = EmployeeSerializer(instance.employee_id).data
        return response


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"


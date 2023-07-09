from datetime import datetime, timedelta

from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, redirect
from django.template.context_processors import request
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework import viewsets, generics
# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from BestCarePharmacyApp.models import Company, CompanyBank, MedicalDetails, CompanyAccount, CustomerRequest, Bill, \
    BillDetails, Employee, Doctor, Orders
from BestCarePharmacyApp.serializers import CompanySerializer, CompanyBankSerializer, MedicineSerializer, \
    MedicalDetailsSerializer, MedicalDetailsSerializerSimple, CompanyAccountSerializer, CustomerSerializer, \
    BillSerializer, BillDetailsSerializer, CustomerRequestSerializer, EmployeeSerializer, DoctorSerializer, \
    OrdersRequestSerializer
from .middlewares.auth import auth_middleware
from .models import Medicine, Users
from django.http import HttpResponse


class Index(View):
    def get(self,request):
        cart = request.session.get('cart')
        if not cart:
            request.session['cart'] = {}
        medicines = Medicine.get_all_Medicine()
        print(medicines)
        return render(request, 'index.html', {'medicines': medicines})

    def post(self,request):
        medicine = request.POST.get('medicine')
        remove = request.POST.get('remove')
        #print(product)
        cart = request.session.get('cart')
        if cart:
            quantity = cart.get(medicine)
            if quantity:
                if remove:
                    if quantity <= 1:
                        cart.pop(medicine)
                    else:
                        cart[medicine] = quantity - 1
                else:
                    cart[medicine] = quantity + 1
            else:
                cart[medicine] = 1
        else:
            cart = {}
            cart[medicine] = 1
        request.session['cart'] = cart
        print(request.session['cart'])
        return redirect('homepage')

def consultdoctor(request):
    doctors = Doctor.get_all_Doctor()
    print(doctors)
    return render(request, 'consultdoctor.html', {'doctors': doctors})


def validateCustomer(customer):
    error_message = None
    if not customer.first_name:
        error_message = "First Name Required"
    elif len(customer.first_name) < 3:
        error_message = 'First Name must be 3 char long or more'
    elif not customer.last_name:
        error_message = "Last Name Required"
    elif len(customer.last_name) < 4:
        error_message = 'First Name must be 4 char long or more'
    elif not customer.phone:
        error_message = "Phone Number Required"
    elif len(customer.phone) < 10:
        error_message = 'Phone Number must be 4 char long'
    elif not customer.password:
        error_message = "Password Required"
    elif len(customer.password) < 6:
        error_message = 'Password 6 char long'
    elif customer.isExists():
        error_message = 'Email Address Already Registerd...'
    return error_message


def registerUser(request):
    postData = request.POST
    first_name = postData.get('first_name')
    last_name = postData.get('last_name')
    phone = postData.get('phone')
    email = postData.get('email')
    password = postData.get('password')
    # validation

    # Hold Value in dictionary
    # Values send to signup page
    value = {
        'first_name': first_name,
        'last_name': last_name,
        'phone': phone,
        'email': email
    }

    error_message = None

    customer = Users(first_name=first_name, last_name=last_name, phone=phone, email=email, password=password)
    error_message = validateCustomer(customer)

    # saving
    if not error_message:
        # print(first_name,last_name,phone,email,password)
        customer.password = make_password(customer.password)
        customer.register()
        return redirect('homepage')
    else:
        data = {
            'error': error_message,
            'values': value
        }
        return render(request, 'signup.html', data)


def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    else:
        return registerUser(request)


class Login(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        email = request.POST.get('email')
        password = request.POST.get('password')
        customer = Users.getCustomer_by_email(email)
        error_message = None
        if customer:
            flag = check_password(password, customer.password)
            if flag:
                request.session['customer'] = customer.id
                return redirect('homepage')
            else:
                error_message = 'Email or Password Invalid'
        else:
            error_message = 'Email or Password Invalid'
        # print(email,password)
        return render(request, 'login.html', {'error': error_message})

def logout(request):
    request.session.clear()
    return redirect('login')

class Cart(View):
    def get(self, request):
        ids = (list(request.session.get('cart').keys()))
        medicines = Medicine.get_Medicine_by_id(ids)
        print(medicines)
        return render(request, 'cart.html', {'medicines': medicines})


class CheckOut(View):
    def post(self,request):
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        customer = request.session.get('customer')
        cart = request.session.get('cart')
        medicines = Medicine.get_Medicine_by_id(list(cart.keys()))
        #print(address, phone, customer, cart, medicines)

        for medicine in medicines:
            #print(cart.get(str(medicine.id)))
            order = Orders(customer=Users(id = customer), medicine=medicine, price=medicine.sell_price,
                               quantity=cart.get(str(medicine.id)), address=address, phone=phone)
            order.placeOrder()
        request.session['cart'] = {}

        return redirect('cart')


class OrdersView(View):
    def get(self,request):
        customer = request.session.get('customer')
        orders = Orders.get_orders_by_customer(customer)
        #print(orders)
        return render(request, 'orders.html', {'orders': orders})


def search(request):
    query = request.GET['query']
    medicines = Medicine.objects.filter(name__icontains=query)
    params = {'medicines': medicines,'query': query}
    return render(request, 'search.html', params)


class CompanyViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        company = Company.objects.all()
        serializer = CompanySerializer(company, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All Company List Data", "data": serializer.data}
        return Response(response_dict)

    def create(self, request):
        try:
            serializer = CompanySerializer(data=request.data, context={"request": request})
            print(request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Company Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Company Data"}
        return Response(dict_response)

    def retrieve(self, request, pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset, pk=pk)
        serializer = CompanySerializer(company, context={"request": request})

        serializer_data = serializer.data

        company_bank_details = CompanyBank.objects.filter(company_id=serializer_data["id"])
        companybank_details_serializers = CompanyBankSerializer(company_bank_details, many=True)
        serializer_data["company_bank"] = companybank_details_serializers.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})

    def update(self, request, pk=None):
        try:
            queryset = Company.objects.all()
            company = get_object_or_404(queryset, pk=pk)
            serializer = CompanySerializer(company, data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Successfully Updated Company Data"}
        except:
            dict_response = {"error": True, "message": "Error During Updating Company Data"}
        return Response(dict_response)


class CompanyBankViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = CompanyBankSerializer(data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Company Bank Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Company Bank Data"}
        return Response(dict_response)

    def list(self, request):
        companybank = CompanyBank.objects.all()
        serializer = CompanyBankSerializer(companybank, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All CompanyBank List Data", "data": serializer.data}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = CompanyBank.objects.all()
        companybank = get_object_or_404(queryset, pk=pk)
        serializer = CompanyBankSerializer(companybank, context={"request": request})
        return Response({"error": False, "message": "Single Data Fetch", "data": serializer.data})

    def update(self, request, pk=None):
        queryset = CompanyBank.objects.all()
        companybank = get_object_or_404(queryset, pk=pk)
        serializer = CompanyBankSerializer(companybank, data=request.data, context={"request": request})
        serializer.is_valid()
        serializer.save()
        return Response({"error": False, "message": "Data Has Been Updated"})


class CompanyNameViewSet(generics.ListAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):
        name = self.kwargs["name"]
        return Company.objects.filter(name=name)


class CompanyOnlyViewSet(generics.ListAPIView):
        serializer_class = CompanySerializer

        def get_queryset(self):
            return Company.objects.all()


class MedicineByNameViewSet(generics.ListAPIView):
    serializer_class = MedicineSerializer

    def get_queryset(self):
        name = self.kwargs["name"]
        return Medicine.objects.filter(name__contains=name)


class MedicineOnlyViewSet(generics.ListCreateAPIView):
    serializer_class = MedicineSerializer
    queryset = Medicine.objects.all()


class OrdersListViewSet(generics.ListCreateAPIView):
    serializer_class = OrdersRequestSerializer
    queryset = Orders.objects.all()


class MedicineViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = MedicineSerializer(data=request.data, context={"request": request})
            print(type(request.data['name']))
            serializer.is_valid(raise_exception=True)
            print(serializer.is_valid())
            detail = serializer.save()
            print(detail)
            medicine_id = serializer.data['id']
            # Access The Serializer Id Which Just Save in OUR Database Table
            # print(medicine_id)

            # Adding and Saving Id into Medidine Details Table
            medicine_details_list = []
            for medicine_detail in request.data["medicine_details"]:
                # print(medicine_detail)

                # Adding medicine id which will work for medicine details serializer
                medicine_detail["medicine_id"] = medicine_id
                medicine_details_list.append(medicine_detail)
                # print(medicine_detail)

            serializer2 = MedicalDetailsSerializer(data=medicine_details_list, many=True, context={"request": request})
            serializer2.is_valid()
            serializer2.save()

            dict_response = {"error": False, "message": "Medicine Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Medicine Data"}
        return Response(dict_response)

    def list(self, request):
        medicine = Medicine.objects.all()
        serializer = MedicineSerializer(medicine, many=True, context={"request": request})

        medicine_data = serializer.data
        newmedicinelist = []

        # Adding Extra Key For Medicine Details in Medicine
        for medicine in medicine_data:
            # Accesing all the Medicine Details of Current Medicine ID
            medicine_details = MedicalDetails.objects.filter(medicine_id=medicine["id"])
            medicine_details_serializers = MedicalDetailsSerializerSimple(medicine_details, many=True)
            medicine["medicine_details"] = medicine_details_serializers.data
            newmedicinelist.append(medicine)

        response_dict = {"error": False, "message": "All Medicine List Data", "data": newmedicinelist}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = Medicine.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = MedicineSerializer(medicine, context={"request": request})

        serializer_data = serializer.data

        medicine_details = MedicalDetails.objects.filter(medicine_id=serializer_data["id"])
        medicine_details_serializers = MedicalDetailsSerializerSimple(medicine_details, many=True)
        serializer_data["medicine_details"] = medicine_details_serializers.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})

    def update(self, request, pk=None):
        queryset = Medicine.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = MedicineSerializer(medicine, data=request.data, context={"request": request})
        print(request.data)
        serializer.is_valid()
        serializer.save()
        for salt_detail in request.data["medicine_details"]:
            if salt_detail["id"] == 0:
                # For Insert New Salt Details
                del salt_detail["id"]
                salt_detail["medicine_id"] = serializer.data["id"]
                serializer2 = MedicalDetailsSerializer(data=salt_detail, context={"request": request})
                serializer2.is_valid()
                serializer2.save()

            else:
                # For Update Salt Details
                queryset2 = MedicalDetails.objects.all()
                medicine_salt = get_object_or_404(queryset2, pk=salt_detail["id"])
                del salt_detail["id"]
                serializer3 = MedicalDetailsSerializer(medicine_salt, data=salt_detail, context={"request": request})
                serializer3.is_valid()
                serializer3.save()

        return Response({"error": False, "message": "Data Has Been Updated"})


# Company Account ViewSet


class CompanyAccountViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = CompanyAccountSerializer(data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Company Account Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Company Account Data"}
        return Response(dict_response)

    def list(self, request):
        companyaccount = CompanyAccount.objects.all()
        serializer = CompanyAccountSerializer(companyaccount, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All CompanyAccount List Data", "data": serializer.data}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = CompanyAccount.objects.all()
        companyaccount = get_object_or_404(queryset, pk=pk)
        serializer = CompanyAccountSerializer(companyaccount, context={"request": request})
        return Response({"error": False, "message": "Single Data Fetch", "data": serializer.data})

    def update(self, request, pk=None):
        queryset = CompanyAccount.objects.all()
        companyaccount = get_object_or_404(queryset, pk=pk)
        serializer = CompanyAccountSerializer(companyaccount, data=request.data, context={"request": request})
        serializer.is_valid()
        serializer.save()
        return Response({"error": False, "message": "Data Has Been Updated"})


class EmployeeViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = EmployeeSerializer(data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Employee Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Employee Data"}
        return Response(dict_response)

    def list(self, request):
        employee = Employee.objects.all()
        serializer = EmployeeSerializer(employee, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All Employee List Data", "data": serializer.data}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = Employee.objects.all()
        employee = get_object_or_404(queryset, pk=pk)
        serializer = EmployeeSerializer(employee, context={"request": request})
        return Response({"error": False, "message": "Single Data Fetch", "data": serializer.data})

    def update(self, request, pk=None):
        queryset = Employee.objects.all()
        employee = get_object_or_404(queryset, pk=pk)
        serializer = EmployeeSerializer(employee, data=request.data, context={"request": request})
        serializer.is_valid()
        serializer.save()
        return Response({"error": False, "message": "Data Has Been Updated"})


class GenerateBillViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):

            # First Save Customer Dataf
            serializer = CustomerSerializer(data=request.data, context={"request": request})
            #print(request.data)
            serializer.is_valid()
            serializer.save()
            customer_id = serializer.data['id']

            # Save Bill Data
            billdata = {}
            billdata["customer_id"] = customer_id
            serializer2 = BillSerializer(data=billdata, context={"request": request})
            serializer2.is_valid()
            serializer2.save()

            bill_id = serializer2.data['id']

            # Access The Serializer Id Which Just Save in OUR Database Table
            # print(medicine_id)

            # Adding and Saving Id into Medidine Details Table
            medicine_details_list = []
            for medicine_detail in request.data["medicine_details"]:
                print(medicine_detail)
                medicine_detail1 = {}
                medicine_detail1["medicine_id"] = medicine_detail["id"]
                medicine_detail1["bill_id"] = bill_id
                medicine_detail1["qty"] = medicine_detail["qty"]
                medicine_deduct = Medicine.objects.get(id=medicine_detail["id"])
                medicine_deduct.in_stock_total = int(medicine_deduct.in_stock_total) - int(medicine_detail['qty'])
                medicine_deduct.save()
                medicine_details_list.append(medicine_detail1)
                # print(medicine_detail)

            serializer3 = BillDetailsSerializer(data=medicine_details_list, many=True,
                                                   context={"request": request})
            serializer3.is_valid()
            serializer3.save()

            dict_response = {"error": False, "message": "Bill Generate Successfully"}
            #dict_response = {"error": True, "message": "Error During Generating Bill"}
            return Response(dict_response)

    def list(self, request):
        medicine = Medicine.objects.all()
        serializer = MedicineSerializer(medicine, many=True, context={"request": request})
        id = serializer['id']
        medicine_deduct = Medicine.objects.get(id=medicine_detail["id"])
        medicine_deduct.in_stock_total = int(medicine_deduct.in_stock_total) - int(medicine_detail['qty'])
        medicine_deduct.save()

        medicine_data = serializer.data
        newmedicinelist = []

        # Adding Extra Key For Medicine Details in Medicine
        for medicine in medicine_data:
            # Accesing all the Medicine Details of Current Medicine ID
            medicine_details = MedicalDetails.objects.filter(medicine_id=medicine["id"])
            medicine_details_serializers = MedicalDetailsSerializerSimple(medicine_details, many=True)
            medicine["medicine_details"] = medicine_details_serializers.data
            newmedicinelist.append(medicine)

        response_dict = {"error": False, "message": "All Medicine List Data", "data": newmedicinelist}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = Medicine.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = MedicineSerializer(medicine, context={"request": request})

        serializer_data = serializer.data

        medicine_details = MedicalDetails.objects.filter(medicine_id=serializer_data["id"])
        medicine_details_serializers = MedicalDetailsSerializerSimple(medicine_details, many=True)
        serializer_data["medicine_details"] = medicine_details_serializers.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})

    def update(self, request, pk=None):
        queryset = Medicine.objects.all()
        medicine = get_object_or_404(queryset, pk=pk)
        serializer = MedicineSerializer(medicine, data=request.data, context={"request": request})
        # print(request.data)
        serializer.is_valid()
        serializer.save()
        for salt_detail in request.data["medicine_details"]:
            if salt_detail["id"] == 0:
                # For Insert New Salt Details
                del salt_detail["id"]
                salt_detail["medicine_id"] = serializer.data["id"]
                serializer2 = MedicalDetailsSerializer(data=salt_detail, context={"request": request})
                serializer2.is_valid()
                serializer2.save()

            else:
                # For Update Salt Details
                queryset2 = MedicalDetails.objects.all()
                medicine_salt = get_object_or_404(queryset2, pk=salt_detail["id"])
                del salt_detail["id"]
                serializer3 = MedicalDetailsSerializer(medicine_salt, data=salt_detail,
                                                       context={"request": request})
                serializer3.is_valid()
                serializer3.save()

        return Response({"error": False, "message": "Data Has Been Updated"})


class CustomerRequestViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        customer_request = CustomerRequest.objects.all()
        serializer = CustomerRequestSerializer(customer_request, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All Customer Request Data", "data": serializer.data}
        return Response(response_dict)

    def create(self, request):
        try:
            serializer = CustomerRequestSerializer(data=request.data, context={"request": request})
            print(request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Customer Request Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Customer Request Data"}
        return Response(dict_response)

    def retrieve(self, request, pk=None):
        queryset = CustomerRequest.objects.all()
        customer_request = get_object_or_404(queryset, pk=pk)
        serializer = CustomerRequestSerializer(customer_request, context={"request": request})

        serializer_data = serializer.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})

    def update(self, request, pk=None):
        try:
            queryset = CustomerRequest.objects.all()
            customer_request = get_object_or_404(queryset, pk=pk)
            serializer = CustomerRequestSerializer(customer_request, data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Successfully Updated Customer Data"}
        except:
            dict_response = {"error": True, "message": "Error During Updating Customer Data"}
        return Response(dict_response)


class OrdersViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        order = Orders.objects.all()
        serializer = OrdersRequestSerializer(order, many=True, context={"request": request})

        response_dict = {"error": False, "message": "All Orders Data", "data": serializer.data}
        return Response(response_dict)

    def retrieve(self, request, pk=None):
        queryset = str(Orders.objects.all())
        order = get_object_or_404(queryset, pk=pk)
        serializer = OrdersRequestSerializer(order, context={"request": request})

        serializer_data = serializer.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})

    def update(self, request, pk=None):
        try:
            queryset = Orders.objects.all()
            customer_request = get_object_or_404(queryset, pk=pk)
            serializer = OrdersRequestSerializer(customer_request, data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Successfully Updated Order Data"}
        except:
            dict_response = {"error": True, "message": "Error During Updating Order Data"}
        return Response(dict_response)


class HomeApiViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self,request):
        customer_request = CustomerRequest.objects.all()
        customer_request_serializer = CustomerRequestSerializer(customer_request,many=True,context={"request":request})

        bill_count = Bill.objects.all()
        bill_count_serializer = BillSerializer(bill_count, many=True,context={"request": request})

        medicine_count = Medicine.objects.all()
        medicine_count_serializer = MedicineSerializer(medicine_count, many=True, context={"request": request})

        medicines = Medicine.objects.all()
        for medicine in medicines:
            if(medicine.name):
                if(medicine.in_stock_total < 100):
                    stock = medicine.in_stock_total
                    medicine_name = medicine.name
                    #print(stock, str(medicine.name))

        company_count = Company.objects.all()
        company_count_serializer = CompanySerializer(company_count, many=True, context={"request": request})


        bill_details = BillDetails.objects.all()
        profit_amt = 0
        sell_amt = 0
        buy_amt = 0

        for bill in bill_details:
            buy_amt = buy_amt + float(bill.medicine_id.buy_price)
            sell_amt = sell_amt + float(bill.medicine_id.sell_price)

        profit_amt = sell_amt - buy_amt

        customer_request_pending = CustomerRequest.objects.filter(status=False)
        customer_request_pending_serializer = CustomerRequestSerializer(customer_request_pending, many=True,context={"request": request})

        customer_request_completed = CustomerRequest.objects.filter(status=True)
        customer_request_completed_serializer = CustomerRequestSerializer(customer_request_completed, many=True,context={"request": request})

        current_date = datetime.today().strftime("%Y-%m-%d")
        current_date1 = datetime.today()
        current_date_7days = current_date1 + timedelta(days=7)
        current_date_7days = current_date_7days.strftime("%Y-%m-%d")
        bill_details_today = BillDetails.objects.filter(added_on__date=current_date)
        profit_amt_today = 0
        sell_amt_today = 0
        buy_amt_today = 0

        for bill in bill_details_today:
            buy_amt_today = float(buy_amt_today + float(bill.medicine_id.buy_price)) * int(bill.qty)
            sell_amt_today = float(sell_amt_today + float(bill.medicine_id.sell_price)) * int(bill.qty)

        profit_amt_today = sell_amt_today - buy_amt_today

        medicine_expire = Medicine.objects.filter(expire_date__range=[current_date,current_date_7days])
        medicine_expire_serializer = MedicineSerializer(medicine_expire,many=True,context={"request":request})

        bill_dates = BillDetails.objects.order_by().values("added_on__date").distinct()
        profit_chart = []
        sell_chart = []
        buy_chart = []
        for billdate in bill_dates:
            access_date = billdate["added_on__date"]

            bill_data = BillDetails.objects.filter(added_on__date=access_date)
            profit_amt_inner = 0
            sell_amt_inner = 0
            buy_amt_inner = 0

            for billsingle in bill_data:
                buy_amt_inner = float(buy_amt_inner + float(billsingle.medicine_id.buy_price)) * int(billsingle.qty)
                sell_amt_inner = float(sell_amt_inner + float(billsingle.medicine_id.sell_price)) * int(billsingle.qty)

            profit_amt_inner = sell_amt_inner - buy_amt_inner
            profit_chart.append({"date":access_date,"amt":profit_amt_inner})
            sell_chart.append({"date":access_date,"amt":sell_amt_inner})
            buy_chart.append({"date":access_date,"amt":buy_amt_inner})

        dict_response = {"error":False,"message":"Home Page Data","customer_request":len(customer_request_serializer.data)
                        ,"bill_count":len(bill_count_serializer.data),"medicine_count":len(medicine_count_serializer.data)
                         ,"company_count":len(company_count_serializer.data),"sell_total":sell_amt,"buy_total":buy_amt,"profit_total":profit_amt
                         ,"request_pending":len(customer_request_pending_serializer.data),"request_completed":len(customer_request_completed_serializer.data)
                         ,"profit_amt_today":profit_amt_today,"sell_amt_today":sell_amt_today
                         ,"medicine_expire":len(medicine_expire_serializer.data)
                         ,"sell_chart":sell_chart,"buy_chart":buy_chart,"profit_chart":profit_chart
                         ,"medicine_stock":stock,"medicine_name":medicine_name}
        return Response(dict_response)


class DoctorViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    def list(self, request):
        doctor = Doctor.objects.all()
        serializer = DoctorSerializer(doctor, many=True, context={"request": request})
        response_dict = {"error": False, "message": "All Doctor List Data", "data": serializer.data}
        return Response(response_dict)

    def create(self, request):
        try:
            serializer = DoctorSerializer(data=request.data, context={"request": request})
            print(request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Doctor Data Save Successfully"}
        except:
            dict_response = {"error": True, "message": "Error During Saving Doctor Data"}
        return Response(dict_response)

    def retrieve(self, request, pk=None):
        queryset = Doctor.objects.all()
        company = get_object_or_404(queryset, pk=pk)
        serializer = DoctorSerializer(company, context={"request": request})

        serializer_data = serializer.data

        return Response({"error": False, "message": "Single Data Fetch", "data": serializer_data})


    def update(self, request, pk=None):
        try:
            queryset = Doctor.objects.all()
            doctor = get_object_or_404(queryset, pk=pk)
            serializer = DoctorSerializer(doctor, data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            dict_response = {"error": False, "message": "Successfully Updated Doctor Data"}
        except:
            dict_response = {"error": True, "message": "Error During Updating Doctor Data"}
        return Response(dict_response)


company_list = CompanyViewSet.as_view({"get": "list"})
company_create = CompanyViewSet.as_view({"post": "create"})
company_update = CompanyViewSet.as_view({"put": "update"})

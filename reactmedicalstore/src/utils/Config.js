class Config{
    static loginUrl = "http://127.0.0.1:8000/api/gettoken/";
    static homeUrl = "/home";
    static logoutUrl = "/logout";
    static refreshApiUrl = "http://127.0.0.1:8000/api/refresh_token/";
    static companyApiUrl = "http://127.0.0.1:8000/api/company/";
    static medicinenameApiUrl = "http://127.0.0.1:8000/api/medicinebyname/";
    static companyBankApiUrl = "http://127.0.0.1:8000/api/companybank/";
    static generateBillApiUrl = "http://127.0.0.1:8000/api/generate_bill_api/";
    static companyOnlyApiUrl = "http://127.0.0.1:8000/api/companyonly/";
    static medicineApiUrl = "http://127.0.0.1:8000/api/medicine/";
    static companyAccountApiUrl = "http://127.0.0.1:8000/api/companyaccount/";
    static customerRequestApiUrl = "http://127.0.0.1:8000/api/customer_request/";
    static homeApiUrl = "http://127.0.0.1:8000/api/home_api/";
    static employeeApiUrl = "http://127.0.0.1:8000/api/employee/";
    static doctorApiUrl = "http://127.0.0.1:8000/api/doctor/";
    static ordersApiUrl = "http://127.0.0.1:8000/api/orders/";


    static sidebarItem = [
        {"index":"0","title":"Home","url":"/home","icons":"home"},
        {"index":"1","title":"Company","url":"/company","icons":"assessment"},
        {"index":"2","title":"Add Medicine","url":"/addMedicine","icons":"assessment"},
        {"index":"3","title":"Manage Medicine","url":"/manageMedicine","icons":"assessment"},
        {"index":"4","title":"Manage Company Account","url":"/manageCompanyAccount","icons":"assessment"},
        {"index":"5","title":"Generate Bill","url":"/generateBill","icons":"assessment"},
        {"index":"6","title":"Customer Request","url":"/customerRequest","icons":"assessment"},
        {"index":"7","title":"Manage Employee","url":"/employeeManage","icons":"assessment"},
        {"index":"8","title":"Manage Orders","url":"/manageOrders","icons":"assessment"},
        {"index":"9","title":"Manage Doctor","url":"/doctor","icons":"assessment"},
    ]

}

export default Config;
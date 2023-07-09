import { reactLocalStorage } from "reactjs-localstorage";
import AuthHandler from "./AuthHandler";

const {default:Axios} = require("axios");
const {default : Config} = require("./Config");

class APIHandler{
    async checkLogin(){
        if(AuthHandler.checkTokenExpiry()){
            try{
            var response = await Axios.post(Config.refreshApiUrl,{refresh:AuthHandler.getRefreshToken(),
            });
            reactLocalStorage.set("token",response.data.access);
        }
        catch(error){
            console.log(error);
            //Not using valid token for refresh then logout the user
            AuthHandler.logoutUser();
            window.location = "/";
        }
    }
    }

    async saveCompanyData(name,license_no,address,contact_no,email,description){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.post(Config.companyApiUrl,{name:name,license_no:license_no,address:address,contact_no:contact_no,email:email,description:description},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    
    async fetchAllCompany(){
        await this.checkLogin();

        var response = await Axios.get(Config.companyApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchAllDoctor(){
        await this.checkLogin();

        var response = await Axios.get(Config.doctorApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchHomePage(){
        await this.checkLogin();

        var response = await Axios.get(Config.homeApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchAllCustomerRequest(){
        await this.checkLogin();

        var response = await Axios.get(Config.customerRequestApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }
    
    async fetchAllOrders(){
        await this.checkLogin();

        var response = await Axios.get(Config.ordersApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async saveCustomerRequestData(name,phone,medicine_details,prescription){
        //Wait untill Token get Updated
        await this.checkLogin();
        var formData = new FormData()
        formData.append("customer_name",name)
        formData.append("phone",phone)
        formData.append("medicine_details",medicine_details)
        formData.append("prescription",prescription)
        var response = await Axios.post(Config.customerRequestApiUrl,
            formData,
            {headers:{Authorization:"Bearer "+AuthHandler.getLoginToken(),"Content-Type":"multipart/form-data"}});
        return response;
    }

    async saveDoctorData(name,image,doctor_type,phone,email){
        //Wait untill Token get Updated
        await this.checkLogin();
        var formData = new FormData()
        formData.append("doctor_name",name)
        formData.append("doctor_image",image)
        formData.append("doctor_type",doctor_type)
        formData.append("phone",phone)
        formData.append("email",email)
        var response = await Axios.post(Config.doctorApiUrl,
            formData,
            {headers:{Authorization:"Bearer "+AuthHandler.getLoginToken(),"Content-Type":"multipart/form-data"}});
        return response;
    }


    async updateCustomerRequest(customer_id,name,phone,medicine_details){
        await this.checkLogin();
        var response = await Axios.put(Config.customerRequestApiUrl+""+customer_id+"/",{customer_name:name,phone:phone,medicine_details:medicine_details,status:1},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    
    }

    async updateOrder(customerid,medicine,customer,date,price,quantity,address,phone){
        await this.checkLogin();
        var response = await Axios.put(Config.ordersApiUrl+""+customerid+"/",{medicine:medicine,customer:customer,date:date,price:price,quantity:quantity,address:address,phone:phone,status:1},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    
    }

    async fetchAllCompanyAccount(){
        await this.checkLogin();

        var response = await Axios.get(Config.companyAccountApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }


    async fetchCompanyDetails(id){
        await this.checkLogin();

        var response = await Axios.get(Config.companyApiUrl+""+id+"/",{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchDoctorDetails(id){
        await this.checkLogin();

        var response = await Axios.get(Config.doctorApiUrl+""+id+"/",{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchEmployeeDetails(id){
        await this.checkLogin();

        var response = await Axios.get(Config.employeeApiUrl+""+id+"/",{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    
    async fetchMedicineByNameDetails(name){
        if(name!=""){
        await this.checkLogin();

        var response = await Axios.get(Config.medicinenameApiUrl+""+name,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }else{
        return {data:[]}
    }
    }

    async editCompanyData(name,license_no,address,contact_no,email,description,id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.put(Config.companyApiUrl+""+id+"/",{name:name,license_no:license_no,address:address,contact_no:contact_no,email:email,description:description},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }
    async editDoctorData(doctor_name,doctor_type,phone,email,id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.put(Config.doctorApiUrl+""+id+"/",{doctor_name:doctor_name,doctor_type:doctor_type,phone:phone,email:email},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async editEmployeeData(name,joining_date,phone,address,id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.put(Config.employeeApiUrl+""+id+"/",{name:name,joining_date:joining_date,phone:phone,address:address},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async saveCompanyBankData(bank_account_no,ifsc_no,company_id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.post(Config.companyBankApiUrl,{bank_account_no:bank_account_no,ifsc_no:ifsc_no,company_id:company_id},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchCompanyBankDetails(id){
        await this.checkLogin();

        var response = await Axios.get(Config.companyBankApiUrl+""+id+"/",{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    
    async generateBill(name,address,phone,medicineDetails){
        await this.checkLogin();

        var response = await Axios.post(Config.generateBillApiUrl,{name:name,address:address,contact:phone,medicine_details:medicineDetails},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async editCompanyBankData(bank_account_no,ifsc_no,company_id,id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.put(Config.companyBankApiUrl+""+id+"/",{bank_account_no:bank_account_no,ifsc_no:ifsc_no,company_id:company_id},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }
    

    async fetchCompanyOnly(){
        await this.checkLogin();

        var response = await Axios.get(Config.companyOnlyApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchMedicineOnly(){
        await this.checkLogin();

        var response = await Axios.get(Config.medicineOnlyApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }


    async saveMedicineData(name,medical_type,buy_price,sell_price,c_gst,s_gst,batch_no,shelf_no,expire_date,mfg_date,company_id,description,in_stock_total,qty_in_strip,medicine_img,medicinedetails){
        //Wait untill Token get Updated
        await this.checkLogin();
        var formData = new FormData()
        formData.append("name",name)
        formData.append("medical_type",medical_type)
        formData.append("buy_price",buy_price)
        formData.append("sell_price",sell_price)
        formData.append("c_gst",c_gst)
        formData.append("s_gst",s_gst)
        formData.append("batch_no",batch_no)
        formData.append("shelf_no",shelf_no)
        formData.append("expire_date",expire_date)
        formData.append("mfg_date",mfg_date)
        formData.append("company_id",company_id)
        formData.append("description",description)
        formData.append("in_stock_total",in_stock_total)
        formData.append("qty_in_strip",qty_in_strip)
        formData.append("medicine_img",medicine_img)
        formData.append("medicinedetails",medicinedetails)
        var response = await Axios.post(Config.medicineApiUrl,formData,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken(),"Content-Type":"multipart/form-data"}});
        return response;
        
    }

    async fetchAllMedicine(){
        await this.checkLogin();

        var response = await Axios.get(Config.medicineApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async editMedicineData(name,medical_type,buy_price,sell_price,c_gst,s_gst,batch_no,shelf_no,expire_date,mfg_date,company_id,description,in_stock_total,qty_in_strip,medicine_img,medicinedetails,id){
        //Wait untill Token get Updated
        await this.checkLogin();
        var formData = new FormData()
        formData.append("name",name)
        formData.append("medical_type",medical_type)
        formData.append("buy_price",buy_price)
        formData.append("sell_price",sell_price)
        formData.append("c_gst",c_gst)
        formData.append("s_gst",s_gst)
        formData.append("batch_no",batch_no)
        formData.append("shelf_no",shelf_no)
        formData.append("expire_date",expire_date)
        formData.append("mfg_date",mfg_date)
        formData.append("company_id",company_id)
        formData.append("description",description)
        formData.append("in_stock_total",in_stock_total)
        formData.append("qty_in_strip",qty_in_strip)
        formData.append("medicine_img",medicine_img)
        formData.append("medicinedetails",medicinedetails)
        formData.append("id",id)
        
        var response = await Axios.put(Config.medicineApiUrl+""+id+"/",
        formData,
        {headers:{Authorization:"Bearer "+AuthHandler.getLoginToken(),"Content-Type":"multipart/form-data"}});
        return response;
        
    }

    async saveCompanyTransactionData(company_id,transaction_type,transaction_amt,transaction_date,payment_mode){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.post(Config.companyAccountApiUrl,{company_id:company_id,transaction_type:transaction_type,transaction_amt:transaction_amt,transaction_date:transaction_date,payment_mode:payment_mode},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

    async fetchEmployeeOnly(){
        await this.checkLogin();

        var response = await Axios.get(Config.employeeApiUrl,{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }
    
    async saveEmployeeData(name,joining_date,phone,address){
        //Wait untill Token get Updated
        await this.checkLogin();
        var response = await Axios.post(Config.employeeApiUrl,{name:name,joining_date:joining_date,phone:phone,address:address},{headers:{Authorization:"Bearer "+AuthHandler.getLoginToken()}});
        return response;
    }

}


export default APIHandler;
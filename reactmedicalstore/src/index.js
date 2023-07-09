import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import MainComponent from './components/MainComponent'
import CompanyComponent from './pages/CompanyComponent'
import HomeComponent from './pages/HomeComponent'
import Login from './pages/Login'
import Config from './utils/Config'
import { PrivateRoute } from './utils/PrivateRoute'
import { PrivateRouteNew } from './utils/PrivateRouteNew'
import LogoutComponent from './pages/LogoutComponent'
import CompanyDetailsComponent from './pages/CompanyDetailsComponent'
import CompanyAddBankComponent from './pages/CompanyAddBankComponent'
import CompanyEditBankComponent from './pages/CompanyEditBankComponent'
import MedicineAddComponent from './pages/MedicineAddComponent'
import MedicineManageComponent from './pages/MedicineManageComponent'
import CompanyAccountComponent from './pages/CompanyAccountComponent'
import BillGenerateComponent from './pages/BillGenerateComponent'
import CustomerRequestComponent from './pages/CustomerRequestComponent'
import EmployeeComponent from './pages/EmployeeComponent'
import EmployeeDetailsComponent from './pages/EmployeeDetailsComponent'
import DoctorComponent from './pages/DoctorComponent'
import DoctorDetailsComponent from './pages/DoctorDetailsComponent'
import Orders from './pages/Orders'

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Login}></Route>
            <Route exact path={Config.logoutUrl} component={LogoutComponent}></Route>
            <PrivateRouteNew exact path="/home" activepage="0" page={HomeComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/company" activepage="1" page={CompanyComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/companydetails/:id" activepage="1" page={CompanyDetailsComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/addCompanyBank/:id" activepage="1" page={CompanyAddBankComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/editCompanyBank/:company_id/:id" activepage="1" page={CompanyEditBankComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/addMedicine" activepage="2" page={MedicineAddComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/manageMedicine" activepage="3" page={MedicineManageComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/manageCompanyAccount" activepage="4" page={CompanyAccountComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/generateBill" activepage="5" page={BillGenerateComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/customerRequest" activepage="6" page={CustomerRequestComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/employeeManage" activepage="7" page={EmployeeComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/employeeDetails/:id" activepage="7" page={EmployeeDetailsComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/doctor" activepage="9" page={DoctorComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/doctordetails/:id" activepage="9" page={DoctorDetailsComponent}></PrivateRouteNew>
            <PrivateRouteNew exact path="/manageOrders" activepage="8" page={Orders}></PrivateRouteNew>
        </Switch>
    </Router>,
    document.getElementById("root")
) 

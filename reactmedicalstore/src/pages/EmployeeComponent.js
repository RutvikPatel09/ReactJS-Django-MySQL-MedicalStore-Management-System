import React from 'react'
import APIHandler from '../utils/APIHandler';
import AuthHandler from '../utils/AuthHandler';

class EmployeeComponent extends React.Component{

    constructor(props){
        super(props)
        this.formSubmit = this.formSubmit.bind(this);
    }

    state={
        errorRes:false,
        errorMessage:"",
        btnMessage:0,
        sendData:false,
        employeeList:[],
        dataLoaded:false,
    };

    async formSubmit(event){
        event.preventDefault();
        this.setState({btnMessage:1})
        var apiHandler = new APIHandler();
        var response = await apiHandler.saveEmployeeData(event.target.name.value,event.target.joining_date.value,event.target.phone.value,event.target.address.value);   
        console.log(response);
        this.setState({btnMessage:0});
        this.setState({errorRes:response.data.error});
        this.setState({errorMessage:response.data.message});
        this.setState({sendData:true});
        this.updateDataAgain();

    }

    //this method work when our page is ready
    componentDidMount(){
        this.fetchEmployeeData();
    }   

    async fetchEmployeeData(){
        this.updateDataAgain();
    }

    async updateDataAgain(){
        var apihandler = new APIHandler();
        var employeeDataList = await apihandler.fetchEmployeeOnly();
        this.setState({employeeList:employeeDataList.data.data})
        this.setState({dataLoaded:true});
    }

    viewEmployeeDetails=(employee_id)=>{
        console.log(employee_id);
        console.log(this.props);
        this.props.history.push("/employeeDetails/"+employee_id);
    }

    
    render(){
        return (
            <section className="content">
            <div className="container-fluid">
                <div className="block-header">
                    <h2>MANAGE EMPLOYEE</h2>
                </div>
                <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card">
                        <div className="header">
                            <h2>
                                Add Employee
                            </h2>
                       </div>
                        <div className="body">
                            <form method="post" onSubmit={this.formSubmit}>
                              <div className="row">
                                  <div className="col-lg-6">
                                <label htmlFor="email_address">Name</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="name" name="name" className="form-control" placeholder="Enter Name"/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-6">
                                <label htmlFor="email_address">Joining Date</label>
                                <div className="form-group">
                                <div className="form-line">
                                        <input type="date" id="joining_date" name="joining_date" className="form-control" placeholder="Enter Date"/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-6">
                                <label htmlFor="email_address">Phone</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="phone" name="phone" className="form-control" placeholder="Enter Phone"/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-6">
                                <label htmlFor="email_address">Address</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="address" name="address" className="form-control" placeholder="Enter Address"/>
                                    </div>
                                </div>
                                </div>
                                </div>
                             
                                <br/>
                                <button type="submit" className="btn btn-primary m-t-15 waves-effect btn-block" disabled={this.state.btnMessage==0?false:true}>{this.state.btnMessage==0?"Add Employee":"Adding Employee Please Wait..."}</button>
                                <br/>
                                {
                                    this.state.errorRes == false && this.state.sendData == true ? ( 
                                <div className="alert alert-success">
                                    <strong>Success!</strong> {this.state.errorMessage}.
                               </div>
                               ):(""
                               )}
                               {
                                   this.state.errorRes == true && this.state.sendData == true ? (
                                <div className="alert alert-danger">
                                    <strong>Failed!</strong> {this.state.errorMessage}.
                                </div>
                                   ):(""    
                                   )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card">
                        <div className="header">
                         {this.state.dataLoaded==false ? (  
                        <div className="text-center">
                            <div class="preloader pl-size-xl">
                                    <div class="spinner-layer">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ):""}
                            <h2>
                                All Employee Data
                            </h2>
                        </div>
                        <div className="body table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>JOINING DATE</th>
                                        <th>PHONE</th>
                                        <th>ADDRESS</th>
                                        <th>ADDED ON</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {this.state.employeeList.map((employee)=>
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.joining_date}</td>
                                            <td>{employee.phone}</td>
                                            <td>{employee.address}</td>
                                            <td>{new Date(employee.added_on).toLocaleString()}</td>
                                            <td><button className="btn btn-block btn-warning" onClick={()=>this.viewEmployeeDetails(employee.id)}>View</button></td>
                                        </tr>
                                   )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
        );
    }
}

export default EmployeeComponent;
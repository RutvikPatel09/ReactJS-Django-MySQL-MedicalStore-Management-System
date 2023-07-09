import React from 'react'
import APIHandler from '../utils/APIHandler';
import AuthHandler from '../utils/AuthHandler';

class EmployeeDetailsComponent extends React.Component{

    constructor(props){
        super(props)
        this.formSubmit = this.formSubmit.bind(this);
        console.log(props.match.params.id);
    }

    state={
        errorRes:false,
        errorMessage:"",
        btnMessage:0,
        sendData:false,
        name:"",
        phone:"",
        address:"",
        joining_date:"",
        dataLoaded:false,
    };

    async formSubmit(event){
        event.preventDefault();
        this.setState({btnMessage:1})
        var apiHandler = new APIHandler();
        var response = await apiHandler.editEmployeeData(event.target.name.value,event.target.joining_date.value,event.target.phone.value,event.target.address.value,this.props.match.params.id);   
        console.log(response);
        this.setState({btnMessage:0});
        this.setState({errorRes:response.data.error});
        this.setState({errorMessage:response.data.message});
        this.setState({sendData:true});

    }

    //this method work when our page is ready
    componentDidMount(){
        this.fetchEmployeeData();
    }   

    async fetchEmployeeData(){
        var apihandler = new APIHandler();
        var employeeData = await apihandler.fetchEmployeeDetails(this.props.match.params.id);
        console.log(employeeData);
        this.setState({name:employeeData.data.data.name})
        this.setState({joining_date:employeeData.data.data.joining_date})
        this.setState({phone:employeeData.data.data.phone})
        this.setState({address:employeeData.data.data.address})
        this.setState({dataLoaded:true});
    }

    viewCompanyDetails=(company_id)=>{
        console.log(company_id);
        console.log(this.props);
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
                                Edit Employee
                            </h2>
                       </div>
                        <div className="body">
                            <form method="post" onSubmit={this.formSubmit}>
                                <label htmlFor="email_address">Name</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="name" name="name" className="form-control" placeholder="Enter Name" defaultValue={this.state.name}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Joining Date</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="date" id="joining_date" name="joining_date" className="form-control" placeholder="Enter Joining Date" defaultValue={this.state.joining_date}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Phone</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="phone" name="phone" className="form-control" placeholder="Enter Company Address" defaultValue={this.state.phone}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Address</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="address" name="address" className="form-control" placeholder="Enter Address" defaultValue={this.state.address}/>
                                    </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary m-t-15 waves-effect btn-block" disabled={this.state.btnMessage==0?false:true}>{this.state.btnMessage==0?"Edit Employee":"Editing Employee Please Wait..."}</button>
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
            
            </div>
        </section>
        );
    }
}

export default EmployeeDetailsComponent;
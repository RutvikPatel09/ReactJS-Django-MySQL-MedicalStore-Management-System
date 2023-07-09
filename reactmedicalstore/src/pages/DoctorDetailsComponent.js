import React from 'react'
import APIHandler from '../utils/APIHandler';
import AuthHandler from '../utils/AuthHandler';

class DoctorDetailsComponent extends React.Component{

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
        companyBank:[],
        doctor_name:"",
        doctor_image:"",
        doctor_type:"",
        phone:"",
        email:"",
        dataLoaded:false,
    };

    async formSubmit(event){
        event.preventDefault();
        this.setState({btnMessage:1})
        var apiHandler = new APIHandler();
        var response = await apiHandler.editDoctorData(event.target.doctor_name.value,event.target.doctor_type.value,event.target.phone.value,event.target.email.value,this.props.match.params.id);   
        console.log(response);
        this.setState({btnMessage:0});
        this.setState({errorRes:response.data.error});
        this.setState({errorMessage:response.data.message});
        this.setState({sendData:true});

    }

    //this method work when our page is ready
    componentDidMount(){
        this.fetchDoctorData();
    }   

    async fetchDoctorData(){
        var apihandler = new APIHandler();
        var doctorData = await apihandler.fetchDoctorDetails(this.props.match.params.id);
        console.log(doctorData);
        this.setState({doctor_name:doctorData.data.data.doctor_name})
        this.setState({doctor_type:doctorData.data.data.doctor_type})
        this.setState({phone:doctorData.data.data.phone})
        this.setState({email:doctorData.data.data.email})
        this.setState({dataLoaded:true});
    }

    render(){
        return (
            <section className="content">
            <div className="container-fluid">
                <div className="block-header">
                    <h2>MANAGE DOCTOR</h2>
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
                                Edit Doctor
                            </h2>
                       </div>
                        <div className="body">
                            <form method="post" onSubmit={this.formSubmit}>
                                <label htmlFor="email_address">Doctor Name</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="doctor_name" name="doctor_name" className="form-control" placeholder="Enter Company Name" defaultValue={this.state.doctor_name}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Doctor Type</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="doctor_type" name="doctor_type" className="form-control" placeholder="Enter Company License No" defaultValue={this.state.doctor_type}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Phone</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="phone" name="phone" className="form-control" placeholder="Enter Company Address" defaultValue={this.state.phone}/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Email</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="email" name="email" className="form-control" placeholder="Enter Company Email" defaultValue={this.state.email}/>
                                    </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary m-t-15 waves-effect btn-block" disabled={this.state.btnMessage==0?false:true}>{this.state.btnMessage==0?"Edit Company":"Editing Company Please Wait..."}</button>
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

export default DoctorDetailsComponent;
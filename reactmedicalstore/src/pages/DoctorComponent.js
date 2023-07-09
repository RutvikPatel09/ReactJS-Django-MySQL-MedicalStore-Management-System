import React from 'react'
import APIHandler from '../utils/APIHandler';
import AuthHandler from '../utils/AuthHandler';

class DoctorComponent extends React.Component{

    constructor(props){
        super(props)
        this.formSubmit = this.formSubmit.bind(this);
    }

    state={
        errorRes:false,
        errorMessage:"",
        btnMessage:0,
        sendData:false,
        doctorDataList:[],
        dataLoaded:false,
    };

    async formSubmit(event){
        event.preventDefault();
        this.setState({btnMessage:1})
        var apiHandler = new APIHandler();
        var response = await apiHandler.saveDoctorData(event.target.doctor_name.value,event.target.doctor_image.files[0],event.target.doctor_type.value,event.target.phone.value,event.target.email.value);   
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
        var doctorData = await apihandler.fetchAllDoctor();
        console.log(doctorData);
        this.setState({doctorDataList:doctorData.data.data});
        this.setState({dataLoaded:true});
    }

    viewDoctorDetails=(doctor_id)=>{
        console.log(doctor_id);
        console.log(this.props);
        this.props.history.push("/doctordetails/"+doctor_id);
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
                            <h2>
                                Add Doctor
                            </h2>
                       </div>
                        <div className="body">
                            <form method="post" onSubmit={this.formSubmit}>
                                <label htmlFor="email_address">Doctor Name</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="doctor_name" name="doctor_name" className="form-control" placeholder="Enter Doctor Name"/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Image</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="file" id="doctor_image" name="doctor_image" className="form-control"/>
                                    </div>
                                </div>
                               <label htmlFor="email_address">Type of Doctor</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="doctor_type" name="doctor_type" className="form-control" placeholder="Enter Type of Doctor"/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Contact No.</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="phone" name="phone" className="form-control" placeholder="Enter Contact No"/>
                                    </div>
                                </div>
                                <label htmlFor="email_address">Email</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="email" name="email" className="form-control" placeholder="Enter Email"/>
                                    </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary m-t-15 waves-effect btn-block" disabled={this.state.btnMessage==0?false:true}>{this.state.btnMessage==0?"Add Doctor":"Adding Doctor Please Wait..."}</button>
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
                                All Companies
                            </h2>
                        </div>
                        <div className="body table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>IMAGE</th>
                                        <th>TYPE_OF_DOCTOR</th>
                                        <th>CONTACT NO.</th>
                                        <th>EMAIL</th>
                                        <th>ADDED ON</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {this.state.doctorDataList.map((doctor)=>
                                        <tr key={doctor.id}>
                                            <td>{doctor.id}</td>
                                            <td>{doctor.doctor_name}</td>
                                            <td><img src={doctor.doctor_image} style={{width:100, height:100}}/></td>
                                            <td>{doctor.doctor_type}</td>
                                            <td>{doctor.phone}</td>
                                            <td>{doctor.email}</td>
                                            <td>{new Date(doctor.added_on).toLocaleString()}</td>
                                            <td><button className="btn btn-block btn-warning" onClick={()=>this.viewDoctorDetails(doctor.id)}>View</button></td>
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

export default DoctorComponent;
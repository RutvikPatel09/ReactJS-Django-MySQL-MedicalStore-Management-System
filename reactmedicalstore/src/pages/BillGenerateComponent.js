import React from 'react'
import { Link } from 'react-router-dom';
import AutoCompleteMedicine from '../components/AutoCompleteMedicine';
import APIHandler from '../utils/APIHandler';
import AuthHandler from '../utils/AuthHandler';

class BillGenerateComponent extends React.Component{

    constructor(props){
        super(props)
        this.formSubmit = this.formSubmit.bind(this);
    }

    state={
        errorRes:false,
        errorMessage:"",
        btnMessage:0,
        sendData:false,
        medicineDetails:[{sr_no:1,id:0,medicine_name:"",qty:"",qty_type:"",unit_price:"",c_gst:"",s_gst:"",amount:""}],
        currentSrno:1,
    };

    async formSubmit(event){
        event.preventDefault();

        console.log(this.state.medicineDetails)
        console.log(event.target.name.value)
        console.log(event.target.address.value)
        console.log(event.target.phone.value)
        this.setState({btnMessage:1})

        var customer_name = event.target.name.value
        var address = event.target.address.value
        var phone = event.target.phone.value

        var apiHandler = new APIHandler();
        var response = await apiHandler.generateBill(event.target.name.value,event.target.address.value,event.target.phone.value,this.state.medicineDetails);   
        console.log(response);
        this.setState({btnMessage:0});
        this.setState({errorRes:response.data.error});
        this.setState({errorMessage:response.data.message});
        this.setState({sendData:true});
        
        this.billGeneratePrint(customer_name,address,phone,this.state.medicineDetails)
    }

    billGeneratePrint(customer_name,address,phone,medicineDetails){
        
        var billdetails = "<div> <style> table{width:100%;border-collapse:collapse} td{padding:5px} th{padding:5px} </style></div>"
        billdetails+="<table border='1'>"
        billdetails+="<tr>"
        billdetails+="<td style='text-align:center' colspan='7'>"
        billdetails+="Bill For Customer"
        billdetails+="</td>"
        billdetails+="</tr>"
        billdetails+="<tr>"
        billdetails+="<td colspan='2'>"
        billdetails+="Customer Name : "+customer_name
        billdetails+="</td>"
        billdetails+="<td colspan='3'>"
        billdetails+="Address : "+address
        billdetails+="</td>"
        billdetails+="<td colspan='2'>"
        billdetails+="Phone : "+phone
        billdetails+="</td>"
        billdetails+="</tr>"
        billdetails+="<tr>"
        billdetails+="<th>"
        billdetails+="SR No ."
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="Medicine Name"
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="Qty"
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="Qty Type"
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="Unit Price"
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="GST"
        billdetails+="</th>"
        billdetails+="<th>"
        billdetails+="Amount"
        billdetails+="</th>"
        billdetails+="</tr>"
        var totalamt = 0

        for(var i=0;i<medicineDetails.length;i++){
            billdetails+="<tr>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].sr_no
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].medicine_name
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].qty
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].qty_type
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].unit_price
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].c_gst + ""+medicineDetails[i].s_gst
            billdetails+="</td>"
            billdetails+="<td>"
            billdetails+=""+medicineDetails[i].amount
            billdetails+="</td>"
            billdetails+="</tr>"
            totalamt += parseInt(medicineDetails[i].amount) 
        }

        billdetails+="<tr>"
        billdetails+="<td colspan='6' style='text-align:right;font-weight:bold;background:green;color:white'>" 
        billdetails+="Total : "+ totalamt 
        billdetails+="</td>"
        billdetails+="</tr>"

        billdetails+="</table>"
        billdetails+="</div>" 

        var mywindow = window.open("","Bill Print","height=650&width=900&top=100&left=100")
        
        mywindow.document.write(billdetails)
        mywindow.print()
    }

    addMedicineDetails=()=>{
        this.state.currentSrno = this.state.currentSrno + 1
        var srno = this.state.currentSrno
        this.state.medicineDetails.push({sr_no:srno,medicine_name:"",qty:"",qty_type:"",unit_price:"",c_gst:"",s_gst:"",amount:""})
        this.setState({})   
    }

    removeMedicineDetails=()=>{
        this.state.currentSrno = this.state.currentSrno - 1
        if(this.state.medicineDetails.length > 1){
        this.state.medicineDetails.pop()
        
    }
    this.setState({})
    }

    showDataInInputs=(index,item)=>{
        console.log(index)
        console.log(item)
        this.state.medicineDetails[index].id = item.id
        this.state.medicineDetails[index].qty = 1;
        this.state.medicineDetails[index].qty_type = "Pieces";
        this.state.medicineDetails[index].unit_price = item.sell_price;
        this.state.medicineDetails[index].c_gst = item.c_gst;
        this.state.medicineDetails[index].s_gst = item.s_gst;
        this.state.medicineDetails[index].medicine_name = item.name
        this.state.medicineDetails[index].amount = parseInt(item.sell_price) + parseInt(item.c_gst) + parseInt(item.s_gst);
         
        this.setState({})
    }

    qtyChangeUpdate=(event)=>{
        var value = event.target.value
        var index = event.target.dataset.index
        this.state.medicineDetails[index].amount = (parseInt(this.state.medicineDetails[index].unit_price)+parseInt(this.state.medicineDetails[index].c_gst)+parseInt(this.state.medicineDetails[index].s_gst)) * value
        this.state.medicineDetails[index].qty = value
        this.setState({})
    }

    render(){
        return (
            <section className="content">
            <div className="container-fluid">
                <div className="block-header">
                    <h2>GENERATE BILL</h2>
                </div>
                <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card">
                        <div className="header">
                            <h2>
                                Generate Bill for Customers
                            </h2>
                       </div>
                        <div className="body">
                            <form method="post" onSubmit={this.formSubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                <label htmlFor="email_address">Customer Name :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="name" name="name" className="form-control" placeholder="Enter Customer Name"/>
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
                                <div className="row">
                                    <div className="col-lg-6">
                                <label htmlFor="email_address">Phone :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="phone" name="phone" className="form-control" placeholder="Enter Phone"/>
                                    </div>
                                </div>
                                </div>
                                
                                </div>
                            
                                <br/>

                                <h4>Medicine Details</h4>
                                {this.state.medicineDetails.map((item,index)=>(

                                <div className="row" key={index}>
                                    <div className="col-lg-2">
                                <label htmlFor="email_address">SR No :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="sr_no" name="sr_no" className="form-control" placeholder="Enter SR No" defaultValue={index + 1}/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-2">
                                <label htmlFor="email_address">Medicine Name : </label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <AutoCompleteMedicine itemPosition={index} showDataInInputs={this.showDataInInputs}></AutoCompleteMedicine>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-2">
                                <label htmlFor="email_address">Qty :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="qty" name="qty" className="form-control" placeholder="Enter Medicine Qty" data-index={index} onChange={this.qtyChangeUpdate} defaultValue={item.qty}/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-2">
                                <label htmlFor="email_address">Qty Type :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="qty_type" name="qty_type" className="form-control" placeholder="Enter Qty Type" defaultValue={item.qty_type}/>
                                    </div>
                                </div>
                                </div>
                                
                                <div className="col-lg-2">
                                <label htmlFor="email_address">Unit Price :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="unit_price" name="unit_price" className="form-control" placeholder="Enter Unit Price" defaultValue={item.unit_price}/>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-2">
                                <label htmlFor="email_address">Amount :</label>
                                <div className="form-group">
                                    <div className="form-line">
                                        <input type="text" id="amount" name="amount" className="form-control" placeholder="Enter Amount" defaultValue={item.amount}/>
                                    </div>
                                </div>
                                </div>
                              
                                </div>
                                ))}
                                <div className="row">
                                    <div className="col-lg-6">
                                        <button className="btn btn-block btn-success" onClick={this.addMedicineDetails} type="button">Add Medicine Details</button>
                                    </div>  
                                    <div className="col-lg-6">
                                        <button className="btn btn-block btn-warning" onClick={this.removeMedicineDetails} type="button">Remove Medicine Details</button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary m-t-15 waves-effect btn-block" disabled={this.state.btnMessage==0?false:true}>{this.state.btnMessage==0?"Generate Bill":"Generating Bill Please Wait..."}</button>
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

export default BillGenerateComponent;
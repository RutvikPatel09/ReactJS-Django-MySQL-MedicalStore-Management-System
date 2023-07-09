import React from 'react'
import APIHandler from '../utils/APIHandler'
class Orders extends React.Component{

   
    constructor(props){
        super(props)
        //const orderDataList = [];
        //this.fetchOrdersData = this.fetchOrdersData.bind(this)
    }


    state={
        errorRes:false,
        errorMessage:"",
        btnMessage:0,
        sendData:false,
        orderDataList:[],
        medicineList:[],
        dataLoaded:false,
    };
     //this method work when our page is ready
     componentDidMount(){
        this.fetchOrdersData();
    }   
 
    async fetchOrdersData(){
        var apihandler = new APIHandler();
        var ordersData = await apihandler.fetchAllOrders();
        console.log(ordersData);
        this.setState({orderDataList:ordersData.data.data});
        this.setState({dataLoaded:true});
    }

    async completeOrderDetails(customerid,medicine,customer,date,price,quantity,address,phone){
        console.log(customerid)
        var apihandler = new APIHandler();
        var ordersData = await apihandler.updateOrder(customerid,medicine,customer,date,price,quantity,address,phone);
        console.log(ordersData)
        this.fetchOrdersData()
    }
        
    render(){
        return (
            <section className="content">
            <div className="container-fluid">
            <div className="row clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card">
                    <div className="header">
                            <h2>
                                All Orders
                            </h2>
                       </div>
                     
                        <div className="body table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                    <th>Sno.</th>
                                    <th>Medicine</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                {this.state.orderDataList.map((order)=>
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.medicine}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.date}</td>
                                            <td>{order.price}</td>
                                            <td>{order.quantity}</td>
                                            <td>{order.address}</td>
                                            <td>{order.phone}</td>
                                            <td>
                                                {order.status == 0?(
                                                <button className="btn btn-block btn-warning" onClick={()=>this.completeOrderDetails(order.id,order.medicine,order.customer,order.date,order.price,order.quantity,order.address,order.phone)}>Complete</button>
                                                ):(
                                                    <button className="btn btn-block btn-success">Completed</button>
                                                )}
                                            </td>
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

export default Orders;
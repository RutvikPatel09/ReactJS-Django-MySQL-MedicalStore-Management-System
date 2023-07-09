import React from 'react'
import 'adminbsb-materialdesign/plugins/bootstrap/css/bootstrap.css'
import 'adminbsb-materialdesign/plugins/node-waves/waves.css'
import 'adminbsb-materialdesign/plugins/animate-css/animate.css'
import 'adminbsb-materialdesign/css/style.css'
import AuthHandler from '../utils/AuthHandler'
import Config from '../utils/Config'
import { Redirect } from 'react-router'

class Login extends React.Component{

    state={
        username:"",
        password:"",
        btnDisabled:true,
        loginStatus:0,
    }
    saveInputs=(event)=>{
        var key = event.target.name;
        this.setState({[key]:event.target.value});
        if(this.state.username!="" && this.state.password!=""){
            this.setState({btnDisabled: false});
          }
          else{
            this.setState({btnDisabled: true});
          }
        
    }
    formSubmit=(event)=>{
        event.preventDefault();
        console.log(this.state);
        this.setState({loginStatus:1})
        AuthHandler.login(this.state.username,this.state.password,this.handleAjaxResponse);
    }

    handleAjaxResponse=(data)=>{
        console.log(data);
        if(data.error){
            this.setState({loginStatus:4})
          }
          else{
            this.setState({loginStatus:3})
            window.location = Config.homeUrl;
          }
    }

    getMessages=()=>{
        if(this.state.loginStatus===0){
          return "";
        }
        else if(this.state.loginStatus===1){
          return (
            <div class="alert alert-warning">
              <center><strong>Logging in!</strong>Please wait...</center>
            </div>
          );
        }
        else if(this.state.loginStatus===3){
          return (
            <div class="alert alert-success">
               <center><strong>Login Successfull!</strong></center>
            </div>
          );
        }
        else if(this.state.loginStatus===4){
          return (
            <div class="alert alert-danger">
               <center><strong>Invalid Login Details!</strong></center>
            </div>
          );
        }
    };

    render(){


        if(AuthHandler.loggedIn()){
            return <Redirect to={Config.homeUrl}/>;
        }

        document.body.className = "login-page";


        return (
            <div className="login-box">
            <div className="logo">
                <h3 style={{color:"white",marginLeft:"70px",fontFamily:"sans-serif"}}>Best Care Pharmacy</h3>
            </div>
            <div className="card">
                <div className="body">
                    <form id="sign_in" method="POST" onSubmit={this.formSubmit}>
                        <div className="msg">Sign in to start your session</div>
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="material-icons">person</i>
                            </span>
                            <div className="form-line">
                                <input type="text" className="form-control" name="username" placeholder="Username" required autofocus onChange={this.saveInputs}/>
                            </div>
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="material-icons">lock</i>
                            </span>
                            <div className="form-line">
                                <input type="password" className="form-control" name="password" placeholder="Password" required onChange={this.saveInputs}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-8 p-t-5">
                                <input type="checkbox" name="rememberme" id="rememberme" className="filled-in chk-col-pink"/>
                                <label for="rememberme">Remember Me</label>
                            </div>
                            <div className="col-xs-4">
                                <button className="btn btn-block bg-pink waves-effect" type="submit" disabled={this.state.btnDisabled}>SIGN IN</button>
                            </div>
                        </div>
                        <div className="row m-t-15 m-b--20">
                            <div className="col-xs-6">
                                <a href="sign-up.html">Register Now!</a>
                            </div>
                            <div className="col-xs-6 align-right">
                                <a href="forgot-password.html">Forgot Password?</a>
                            </div>
                        </div>
                        {this.getMessages()}
                    </form>
                </div>
            </div>
        </div>
    
        );
    }
}

export default Login;
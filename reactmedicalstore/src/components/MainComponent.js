import React from 'react'
import Overlay from './Overlay'
import PageLoader from './PageLoader'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import HomeComponent from '../pages/HomeComponent'
import 'adminbsb-materialdesign/css/themes/all-themes.css'


class MainComponent extends React.Component{

    state={
        bodyClass : "theme-red ls-closed",
        displayOverlay : "none",
        width : window.screen.width,
    }
    onBarClick=()=>{
        if(this.state.bodyClass==="theme-red ls-closed overlay-open"){
            this.setState({bodyClass:"theme-red ls-closed"})
            this.setState({displayOverlay:"none"})
        }else if(this.state.bodyClass==="theme-red ls-closed"){
            this.setState({bodyClass:"theme-red ls-closed overlay-open"})
            this.setState({displayOverlay:"block"})
        }  
    };

    onscreenresize=()=>{
        console.log(window.screen.width);
        this.setState({width:window.screen.width});
    }

    componentWillMount(){
        window.addEventListener("resize",this.onscreenresize)
    }

    componentWillUnmount(){
        window.removeEventListener("resize",this.onscreenresize)
    }


    componentDidMount(){
        //Select the input
        var inputall = document.querySelectorAll("input");
        //console.log(inputall);
        inputall.forEach((input)=>{
            //Access All Inputs
            //console.log(input);
            input.addEventListener("focus",function(){
                this.parentNode.className = "form-line focused";
            })
            
        });
        inputall.forEach((input)=>{
            //Access All Inputs
            //console.log(input);
            input.addEventListener("blur",function(){
                this.parentNode.className = "form-line";
            })
            
        });
    }

    
    render(){
        console.log(this.props);
        if(this.state.width > 1150){
             document.getElementById("root").className = "theme-red";
        }else{
            document.getElementById("root").className = this.state.bodyClass;
        }

        var Page = this.props.page;


        return (
            <React.Fragment>
                <Overlay display={this.state.displayOverlay}></Overlay>
                <NavBar onBarClick={this.onBarClick}></NavBar>
                <Sidebar activepage={this.props.activepage}></Sidebar>
                <Page {...this.props}></Page>
            </React.Fragment>
        );
    }
}

export default MainComponent;
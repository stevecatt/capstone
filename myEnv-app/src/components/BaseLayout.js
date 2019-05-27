import React, {Component} from 'react';

import { NavLink as RRNavLink } from 'react-router-dom'
import { connect } from 'react-redux'



import * as actionTypes from '../store/actions/actionTypes'


import { setDefaultBreakpoints } from 'react-socks/';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Collapse, NavLink,Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';



setDefaultBreakpoints([
  { xs: 0 },
  { s: 376 },
  { m: 426 },
  { l: 769 },
  { xl: 1025 }
]);




class Menu extends Component {
  constructor(){
    super()
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      collapsed: true
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }


    render(){
        return(
          <div className="container">
        <Navbar  light style={{color:'#076652'}} expand="md">
          <NavbarBrand style={{color:'#076652'}} tag={RRNavLink} to="/"> Home</NavbarBrand>
          <NavbarToggler style={{color:'#076652'}} onClick={this.toggle} />
          <Collapse style={{color:'#076652'}} isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>{this.props.isAuth ? <NavLink style={{color:'#076652'}} tag={RRNavLink} className="font-weight-bold topbar" to="/userpage"> User Map</NavLink>:null}</NavItem>
             
              <NavItem>
              {!this.props.isAuth ?<NavLink style={{color:'#076652'}} tag={RRNavLink} className="font-weight-bold topbar" to="/login"> Login</NavLink>:null}
              </NavItem>
              <NavItem>
              {this.props.isAuth ?  <NavLink style={{color:'#076652'}} tag={RRNavLink} className="font-weight-bold topbar"to="/logout"> Logout </NavLink>:null}
              </NavItem>
              <NavItem>
              {!this.props.isAuth ?<NavLink style={{color:'#076652'}} tag={RRNavLink} className="font-weight-bold topbar" to="/register"> Register</NavLink>:null}
              </NavItem>
              
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
            


class Footer extends Component {

    render() {
      return (
        <div className="footer container">Copyright 2019</div>
      )
    }
  
  }
  
  class BaseLayout extends Component {
    
    componentDidMount(){
      let token = localStorage.getItem('jwtoken')
      let uid = localStorage.getItem('uid')
      this.props.onTokenRecieved(token,uid)
    }
  
    render() {
      return (
        <div>
          <Menu isAuth = {this.props.isAuth}/>
            {this.props.children}
          <Footer/>
        </div>
      )
    }
  
  }

  const mapStateToProps =(state)=>{
    return{
      isAuth: state.isAuthenticated
    }
  }

  const mapDispatchToProps = (dispatch)=>{
    return {
      onTokenRecieved: (token,uid)=> dispatch({type:actionTypes.IS_AUTHENITCATED, token: token,uid:uid})
    }
  }


  export default connect(mapStateToProps,mapDispatchToProps)(BaseLayout)
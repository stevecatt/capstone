import React, {Component} from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { setAuthenticationHeader } from '../utils/authenticate'
import * as actionTypes from '../store/actions/actionTypes'
import * as urls from '../utils/urls'


class Login extends Component {
    constructor(){
        super()
        this.state={
            userName: "",
            password:"",
            message:""
           

        }

    }

    

    handleTextBoxChange = (e) => {

        this.setState({
          //note that this is an array in order to create the states
          [e.target.name]: e.target.value
        })
      
      }

      handleSaveUserClick = () => {
      axios.post(urls.login, {
       
          
           
            userName: this.state.userName,
            password: this.state.password
        
        })
        
        .then(response => {
          if (response.data != false){
          console.log(response)
          let token = response.data.token
          let uid=response.data.uid

          localStorage.setItem('jwtoken',token)
          localStorage.setItem('uid',uid)

          this.props.onTokenRecieved(token,uid)
          setAuthenticationHeader(token)
          console.log("Logged in")
          this.props.history.push('/userpage')
          }else{
            this.setState({
              message:"Incorrect Username or Password"
            })
          }
          
        })
       
        
        }
  

    render(){
        return(
            <div className="container">
               <div>
               <h1>Login</h1>
               <h2>{this.state.message}</h2>
                <input type="text" onChange={this.handleTextBoxChange} placeholder="user name" name="userName" />
                <input type="password" onChange={this.handleTextBoxChange} placeholder="password" name="password" />
                </div>
                <div>
                <button onClick={this.handleSaveUserClick}>Login</button>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    onTokenRecieved: (token,uid)=> dispatch({type:actionTypes.IS_AUTHENITCATED, token: token,uid:uid})
  }
}

const mapStateToProps =(state)=>{
  return{
    isAuth: state.isAuthenticated
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(Login) 
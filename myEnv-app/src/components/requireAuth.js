//this is an upper level function to contain the things that need to be authorized
import React,{Component} from 'react'
import { connect } from 'react-redux'

export default function (ComposedComponent) {
    class Authenticate extends Component{
        //lets the props be available immediatly so the program wont allow unaythorized acces
        constructor(props) {
            super(props)
            if(!this.props.isAuthenticated) {
                this.props.history.push('/login')
            }
        }

        render(){
            return(
                <ComposedComponent {...this.props}/>
            )
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthenticated: state.isAuthenticated
        }
    }
    return connect(mapStateToProps)(Authenticate)
}
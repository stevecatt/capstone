import React, {Component} from 'react';
import * as urls from '../utils/urls'
import { WEATHER_KEY } from "../.env.json";
import { connect } from "react-redux"
import * as actionTypes from '../store/actions/actionTypes'



class Weather extends Component{

    constructor(){
        super()
        this.state={
           
            test:""
           
           

        }

    }

    homeFetched = ()=>{
        let lat = this.props.latitude
        let long =  this.props.longitude
        let url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=imperial&apiKey="+WEATHER_KEY
        fetch(url)
        .then(response => response.json())
        .then((json)=>{
            console.log("this is from weather",json)
            this.props.onHomeWeatherRecieved(json)
            
            this.setState({
                test:"test"
                
            })
        })
        
    }

    componentDidMount (){
        this.homeFetched()
        
    }


    render(){
        return(
            <div>
                <h1>WEATHER</h1>
                <p>{this.state.test}</p>
                
            </div>
        )
    }
}


    const mapStateToProps = (state) =>{
        return{
            latitude: state.latitude,
            longitude: state.longitude,
            airQuality: state.homeAirQuality

        }
    }
  

  const mapDispatchToProps = (dispatch)=>{
    return {
      onHomeWeatherRecieved: (weather)=> dispatch({type:actionTypes.WEATHER_FETCHED, weather:weather})
    }
  }
  

export default connect(mapStateToProps,mapDispatchToProps)(Weather)
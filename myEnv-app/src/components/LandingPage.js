import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {Marker} from 'react-map-gl';
import { MAPBOX_TOKEN } from "../.env.json";
import { CHINA_KEY } from "../.env.json";
import { WEATHER_KEY } from "../.env.json"
import { AIR_KEY } from "../.env.json"
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/actionTypes'
import axios from 'axios'
import * as urls from '../utils/urls'
import '../App.css';
import Weather from './Weather'

class LandingPage extends Component {
    constructor(){
        super()
        this.state={
            
                viewport: {
                 width: 400,
                 height: 400,
                latitude: 29.0,
                longitude: -118.0,
                 zoom:2
              },

        }
        
    }
    getWindDirection = (angle) =>{
    
        let directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
     
    }
  

     getWeather=(lat,long)=>{
    let localWeather= "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=imperial&apiKey="+WEATHER_KEY
    fetch(localWeather)
    .then(response=>response.json())
    .then(weatherItems=>{
      let sunsetHMS = new Date(weatherItems.sys.sunset*1000)
      let sunriseHMS = new Date(weatherItems.sys.sunrise*1000)
      let sunrise = sunriseHMS.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let sunset = sunsetHMS.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let windDirection = this.getWindDirection(weatherItems.wind.deg)
      let windspeed= weatherItems.wind.speed
      let windRound= Math.round(windspeed)
      let temperature =weatherItems.main.temp
      let tempRound = Math.round(temperature)

      console.log(weatherItems)
      this.setState({
        temperature:tempRound,
        sunrise:sunrise,
        sunset:sunset,
        windspeed:windRound,
        windDirection:windDirection,
        weatherIcon:weatherItems.weather[0].icon,
        name:weatherItems.name


      })

      })
    }


    componentDidMount() {
        if('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    viewport: {
                     width:400,
                    height:400,
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude,
                    zoom:8
                    }
                })
                this.props.addedHome(position.coords.latitude,position.coords.longitude)
                let lat = position.coords.latitude
                let long = position.coords.longitude

                let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
                fetch(url)
                 .then(response => response.json())
                .then((json)=>{
                this.setState({
                        aqi:json.data.aqi,
                        city:json.data.city.name,
                        dompol:json.data.dominentpol
            
                })

        })
        this.getWeather(position.coords.latitude,position.coords.longitude)

          })

        }

   }




    render(){
        console.log("landed")
        return(
         <div>  

        <ReactMapGL
        mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})} onClick={this.handleClick}>
        <Marker latitude={this.props.latitude} longitude={this.props.longitude} offsetLeft={-20} offsetTop={-10}>
         <img src='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'/>
     
        </Marker>
    
   
        </ReactMapGL>

        <h1>AQI {this.state.aqi}</h1>
        <h2>{this.state.name}</h2>
    
            <h2>Polutant:{this.state.dompol}</h2>
            <img id= "icon" src= {`http://openweathermap.org/img/w/${this.state.weatherIcon}.png`}/>
            <p>Temperature  :{this.state.temperature}</p>
            <p>Wind    :{this.state.windspeed}{this.state.windDirection}</p>
            <p>Sunrise   : {this.state.sunrise}</p>
            <p>Sunset   : {this.state.sunset}</p>
   

        </div>   
        )
    }
}


const mapStateToProps = (state) =>{
    return{
        latitude: state.latitude,
        longitude: state.longitude,
        userId:state.uid
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedHome: (lat,long) => dispatch({type:actionTypes.ADDED_HOME,lat:lat,long:long}),
    addedMArker:(marker) => dispatch({type:actionTypes.ADDED_MARKER,marker:marker})
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(LandingPage)
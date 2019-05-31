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
//import Weather from './Weather'
import {Table,Container,Row,Col} from 'reactstrap'
import * as funcs from '../utils/functions'
import Keycolors from './Keycolors'
import Breakpoint, { BreakpointProvider } from 'react-socks';
import { setDefaultBreakpoints } from 'react-socks';
import MobLandingPage from './MobLandingPage'

setDefaultBreakpoints([
  { xs: 0 },
  { s: 376 },
  { m: 500},
  { l: 769 },
  { xl: 1025 }
]);

class LandingPage extends Component {
    constructor(){
        super()
        this.state={
            
                viewport: {
                 width: 800,
                 height: 500,
                latitude: 29.0,
                longitude: -118.0,
                 zoom:2
              },
              pm25:"N/A",
              pm10:"N/A",
              no2:"N/A",
              so2:"N/A",
              o3:"N/A",


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
                     width:800,
                    height:500,
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude,
                    zoom:10
                    }
                })
                this.props.addedHome(position.coords.latitude,position.coords.longitude)
                let lat = position.coords.latitude
                let long = position.coords.longitude

                let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
                fetch(url)
                 .then(response => response.json())
                .then((json)=>{
                  console.log("china",json)
                this.setState({
                        aqi:json.data.aqi,
                        city:json.data.city.name,
                        dompol:json.data.dominentpol,
                        
            
                })
                if (json.data.iaqi.o3){
                  this.setState({
                    o3:json.data.iaqi.o3.v,
                  })
                }
                if (json.data.iaqi.so2){
                  this.setState({
                    so2:json.data.iaqi.so2.v,

                  })
                }
                if (json.data.iaqi.pm10){
                  this.setState({
                    pm10:json.data.iaqi.pm10.v
                  })

                }
                if (json.data.iaqi.pm25){
                  this.setState({
                    pm25:json.data.iaqi.pm25.v,
                  })
                }
                
                if (json.data.iaqi.no2){
                  this.setState({
                    no2:json.data.iaqi.no2.v,
                  })
                }

        })
        this.getWeather(position.coords.latitude,position.coords.longitude)

          })

        }

   }




    render(){
      let home=1

      let buttonClass=funcs.buttonClassFunction(this.state.aqi,home)

      

   

        let dompol = "Shitty Air"

      if (this.state.dompol === "pm25"){
        dompol = "Particulates"
       
      }
      else if (this.state.dompol==="pm10"){
        dompol = "particulates"
      }
      else if (this.state.dompol === "o3"){
        dompol = "Ozone"
        
      }
      else if (this.state.dompol === "no2"){
        dompol = "NOx"
       
      }
      else if (this.state.dompol ==="so2"){
        dompol = "Sulphur Dioxide"
       
      }


        console.log("landed")
        return(
          
         <div>  
        <Breakpoint l up>
        <Container>
          
        <Table className = "table">
       <thead>
            <tr>
               <th>Weather Station</th>
               <th></th>
               <th>AQI</th>
               <th>Temp</th>
               <th>Wind</th>
               <th>Sunrise</th>
               <th>Sunset</th>
             </tr>
             </thead>
             <tbody>
               <tr>
                <td>{this.state.name}</td>
                 <td id="image-data"><img id= "icon" src= {`https://openweathermap.org/img/w/${this.state.weatherIcon}.png`}/></td>
                 <td>{this.state.aqi}</td>
                 <td>{this.state.temperature}</td>
                 <td>{this.state.windspeed}{this.state.windDirection}</td>
                 <td>{this.state.sunrise}</td>
                 <td>{this.state.sunset}</td>
               </tr>
             </tbody>
             <thead>
            <tr>
               
               <th>Primary Polutant</th>
               <th>Ozone</th>
               <th>Particulates</th>
               <th>NOx</th>
               <th>Sulphur Dioxide</th>
               
             </tr>
             </thead>
             <tbody>
               <tr>
                
                 <td>{dompol}</td>
                 <td>{this.state.o3}</td>
                 <td>{this.state.pm25}</td>
                 <td>{this.state.no2}</td>
                 <td>{this.state.so2}</td>
                 
               </tr>
             </tbody>
          
       </Table>
       
     
       
       
       <Row>

       <Col className="map-container">

        
        <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})} onClick={this.handleClick}>
        <Marker latitude={this.props.latitude} longitude={this.props.longitude} offsetLeft={-20} offsetTop={-10}>
      
          <button className={buttonClass}>{this.state.aqi}</button>
        </Marker>
    
   
        </ReactMapGL>
        
       
        </Col>
        <Col>
        <Keycolors></Keycolors>
        </Col>
        </Row>

        

         </Container>
         </Breakpoint>
         <Breakpoint m down>
         <MobLandingPage></MobLandingPage>
         </Breakpoint>
   

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
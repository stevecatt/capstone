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

class Mapbox extends Component {
  constructor(){
    super()
    this.state = {
          viewport: {
           width: 800,
           height: 800,
          latitude: 29.0,
          longitude: -118.0,
           zoom:2
        },
        markers: [],
        latitude:0,
        longitude:0,
        aqi:0,
        no2:0,
        city:"",
        dompol:"",
        markerAqi:[],
        message:"",
        windDirection:"",
        windspeed:0,
        temperature:0,
        sunrise:"",
        sunset:"",
        weatherIcon:"",




        mouseOverId:0,
        weather:{}
      };
  }

  onMouseIn =(key)=>{
    console.log(key)
    this.setState({
      mouseOverId :key,
      
    })

   //console.log("what the foo")
  }

  onMouseOut =()=>{
    this.setState({
      mouseOverId:0
      
    })

   //console.log("what the foo")
  }

  getUserMarkers=()=>{
    this.setState({
      marker:[],
      markerAqi:[]
    })
    axios.post(urls.getFavorites,{
      userId:this.props.userId
    })
    .then(markers =>{
      //console.log(markers.data.favorites)
      if(markers.data.favorites.length > 0){
        this.setState({
          marker:this.state.marker.concat(markers.data.favorites)
        })
      }
    })
    .then(()=>{
        this.state.marker.map(llt=>{
       // console.log(llt.lat,llt.long,llt.ts)
        //kinda workd but needs to think about duplivate timestamps 
        this.showMarkers(llt.lat,llt.long,llt.ts)
      })
      
    })
  }

  // getWeather=(lat,long)=>{
  //   let swissurl = "https://api.airvisual.com/v2/nearest_city?lat="+lat+"&lon="+long+"&key="+AIR_KEY
  //   fetch(swissurl)
  //   .then(response=>response.json)
  //   .then((json)=>{
  //     console.log("swiss stuff",json)
  //     this.setState({
  //       weather:"weather"
  //     })
      

  //   })
  // }
 //move this to common functions 
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
  showMarkers=(lat,long,ts)=>{
    let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
    fetch(url)
    .then(response => response.json())
    .then((json)=>{
      console.log("response from china",json)
      let markerAqi = {
        lat:lat,
        long:long,
        ts:ts,
        aqi:json.data.aqi,
        dompol:json.data.dominentpol,
        city:json.data.city.name,
        pm25:json.data.iaqi.pm25,
        o3:json.data.iaqi.o3,
        so2:json.data.iaqi.so2,
        no2:json.data.iaqi.no2,
        name:"",

        iaqi:json.data.iaqi
      }

      //add data from second call to swiss
      let markerAqiAndWeather=Object.assign(markerAqi,{test:"test"})
      console.log(markerAqiAndWeather,"and weather test")
      console.log(markerAqi)
      this.setState({
        
        markerAqi:this.state.markerAqi.concat(markerAqi),
        aqi:json.data.aqi,
        city:json.data.city.name,
        dompol:json.data.dominentpol
        
        
    })
    console.log("trying to find json",json)

    })
  }


  removeIcon=(key)=>{
    
    console.log("this the key",key)
    console.log ("this is marker,",this.state.marker)

    let markers= this.state.markers.filter(mark => mark.ts != key)
    
    this.setState({
      markers:markers,
      markerAqi:[]
    },
    //the comma and () mean wait till im done with previous step when setting state 
    () => {
      
      markers.map(llt=>{
        console.log("this is the feed to aqi,",llt.lat,llt.long,llt.ts)
        //kinda workd but needs to think about duplivate timestamps 
        this.showMarkers(llt.lat,llt.long,llt.ts)
        
      
      })

    })
    
  
    
    console.log ("these are the markers left",markers)
    console.log("i clicked the button",key,this.props.userId)
    axios.post(urls.removeFavorite,{
      markerId:key,
      userId:this.props.userId


    })
    .then((response)=>{
      console.log('this should come back from server',response)
      //this.getUserMarkers()
    })
    .then(()=>{
     //this.getUserMarkers()
      console.log("i should be ready to retrieve stuff ")
    })
  }

  handleClick=(e)=>{
    console.log(e,"we clicked here")
    let markLong = e.lngLat[0]
    let markLat =  e.lngLat[1]
    let ts= e.timeStamp
    let marker = {
      long:markLong,
      lat:markLat,
      ts:ts,
      
    }
    
    //save favorites 
    console.log(markLat,markLong,this.props.userId,ts,"this is what i hope to send")
    axios.post(urls.saveFavorite, {
     
      markLat: markLat,
      markLong:markLong,
      userId: this.props.userId,
      ts:ts
    })

  
  .then(response =>  {
      if(response.data) {
        console.log(response.data)
        //let message= response.data
        this.setState({
          message:"i think this worked"
        })


        
        
      } else if (response.data.error){
        console.log(response.data.error)
       
       
        
       
        
      }else{
          console.log("error")
      }
    })
    console.log(marker)
    this.setState({
      markers:this.state.markers.concat(marker),
      
    })
    this.props.addedMArker(marker)
    //get polution and save fave

        let lat = markLat
        let long = markLong
       this.showMarkers(lat,long,ts)
       //this.getWeather(lat,long)
        
        

  }

  componentDidMount() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude)
       
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          viewport: {
            width:800,
            height:800,
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
    this.getUserMarkers()
   
    
  }

  
  
  render() {
    

    let markerData = this.state.markerAqi.map(data => {
      let pm25=0
      let o3= 0
      let no2=0
      let so2=0
      //account for missing readings
      if (data.pm25==null){
          pm25 = "N/A"
      }
      else{
           pm25 = data.pm25.v
      }
      if (data.o3==null){
          o3 = "N/A"
      }
      else{
        o3 = data.o3.v
      }
      if (data.no2==null){
         no2 = "N/A"
      }
      else{
        no2= data.no2.v
      }
      if (data.so2==null){
       so2 = "N/A"
        }
      else{
         so2 = data.so2.v
      }

      return (
        <Marker   key={data.ts} latitude={data.lat} longitude={data.long} offsetLeft={-20} offsetTop={-10}>
        
         <button  onClick={()=>this.getWeather(data.lat,data.long)} onMouseEnter={()=>this.onMouseIn(data.ts)} onMouseLeave={()=>this.onMouseOut()} onDoubleClick={()=>
          this.removeIcon(data.ts)}>
          {this.state.mouseOverId != data.ts? <span>{data.aqi}</span>:null}
          {this.state.mouseOverId == data.ts ?
          <ul>
          <li>AQI: {data.aqi}</li>
          <li>Primary Polutant:{data.dompol}</li>
          <li>Particulates:{pm25}</li>
          <li>Ozone:{o3}</li>
          <li>NOx:{no2}</li>
          <li>Sulfer Dioxide:{so2}</li>
          
          </ul>: null}
          </button>
          </Marker>
      )
    })
    
    
    return (
      <div>
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})} onClick={this.handleClick}>
     <Marker latitude={this.props.latitude} longitude={this.props.longitude} offsetLeft={-20} offsetTop={-10}>
      <img src='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'/>
     
    </Marker>
    
    {markerData}
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
    

export default connect(mapStateToProps,mapDispatchToProps)(Mapbox)
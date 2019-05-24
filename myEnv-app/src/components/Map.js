import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {Marker} from 'react-map-gl';
import { MAPBOX_TOKEN } from "../.env.json";
import { CHINA_KEY } from "../.env.json";
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/actionTypes'
import axios from 'axios'
import * as urls from '../utils/urls'

class Map extends Component {
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
        marker: [],
        latitude:0,
        longitube:0,
        aqi:0,
        no2:0,
        city:"",
        dompol:"",
        markerAqi:[],
        message:"",
        message:"",
        mouseOverId:0
      };
  }

  onMouseIn =(key)=>{
    console.log(key)
    this.setState({
      mouseOverId :key,
      message:"{:key}"
    })

   console.log("what the foo")
  }

  onMouseOut =()=>{
    this.setState({
      message:""
    })

   console.log("what the foo")
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
      console.log(markers.data.favorites)
      if(markers.data.favorites.length > 0){
        this.setState({
          marker:this.state.marker.concat(markers.data.favorites)
        })
      }
    })
    .then(()=>{
        this.state.marker.map(llt=>{
        console.log(llt.lat,llt.long,llt.ts)
        //kinda workd but needs to think about duplivate timestamps 
        this.showMarkers(llt.lat,llt.long,llt.ts)
      })
      
    })
  }
  
  showMarkers=(lat,long,ts)=>{
    let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
    fetch(url)
    .then(response => response.json())
    .then((json)=>{
      console.log(json)
      let markerAqi = {
        lat:lat,
        long:long,
        ts:ts,
        aqi:json.data.aqi,
        dompol:json.data.dominentpol,
        city:json.data.city.name,
      }
      console.log(markerAqi)
      this.setState({
        
        markerAqi:this.state.markerAqi.concat(markerAqi),
        aqi:json.data.aqi,
        city:json.data.city.name,
        dompol:json.data.dominentpol
        
        
    })

    })
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
        
      })
    }
    this.getUserMarkers()
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
      marker:this.state.marker.concat(marker),
      
    })
    this.props.addedMArker(marker)
    //get polution and save fave

        let lat = markLat
        let long = markLong
       this.showMarkers(lat,long,ts)
        
        

  }
  
  removeIcon=(key,e)=>{
    
    console.log("this the key",key)
    console.log ("this is markerst,",this.state.marker)

    let markers= this.state.marker.filter(mark => mark.ts != key)
    console.log(e,"this is e")
    this.setState({
      marker:markers,
      markerAqi:[]
    }, () => {
      
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
  render() {

    let markerData = this.state.markerAqi.map(data => {
      return (
        <Marker   key={data.ts} latitude={data.lat} longitude={data.long} offsetLeft={-20} offsetTop={-10}>
        
         <button  onMouseEnter={()=>this.onMouseIn(data.ts)} onMouseLeave={()=>this.onMouseOut()} onDoubleClick={()=>
          this.removeIcon(data.ts)}>{data.aqi}{this.state.mouseOverId == data.ts ? this.state.message : null}</button></Marker>
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
    <h2>{this.state.city}</h2>
    <h2>{this.state.dompol}</h2>
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
    

export default connect(mapStateToProps,mapDispatchToProps)(Map)
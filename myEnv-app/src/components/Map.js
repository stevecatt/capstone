import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {Marker} from 'react-map-gl';
import { MAPBOX_TOKEN } from "../.env.json";
import { CHINA_KEY } from "../.env.json";
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/actionTypes'

class Map extends Component {
  constructor(){
    super()
    this.state = {
          viewport: {
           width: 400,
           height: 400,
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
        dompol:""
      };
  }



  componentDidMount() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude)
       
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
      })
    }
  }

  handleClick=(e)=>{
    console.log(e,"we clicked here")
    let marklong = e.lngLat[0]
    let marklat =  e.lngLat[1]
    let ts= e.timeStamp
    let marker = {
      long:marklong,
      lat:marklat,
      ts:ts
    }
    console.log(marker)
    this.setState({
      marker:this.state.marker.concat(marker)
    })
    this.props.addedMArker(marker)

        let lat = marklat
        let long = marklong
        let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
        fetch(url)
        .then(response => response.json())
        .then((json)=>{
          console.log(json)
          this.setState({
            //no2:json.data.iaqi.no2.v,
            aqi:json.data.aqi,
            city:json.data.city.name,
            dompol:json.data.dominentpol
            
            
        })

        })

  }
  
  removeIcon=(key)=>{
    console.log("i clicked the button")
  }
  render() {

    let markerData = this.state.marker.map(data => {
      return (
        <Marker key={data.ts} latitude={data.lat} longitude={data.long} offsetLeft={-20} offsetTop={-10}>
        
         <button onClick={()=>
          this.removeIcon(data.ts)}>{this.state.aqi}</button></Marker>
      )
    })

    
    return (
      <div>
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v10"
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
            longitude: state.longitude
        }
    }

    const mapDispatchToProps = (dispatch) => {
      return {
        addedHome: (lat,long) => dispatch({type:actionTypes.ADDED_HOME,lat:lat,long:long}),
        addedMArker:(marker) => dispatch({type:actionTypes.ADDED_MARKER,marker:marker})
      }
    }
    

export default connect(mapStateToProps,mapDispatchToProps)(Map)
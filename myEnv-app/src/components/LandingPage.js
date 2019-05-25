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
    render(){
        console.log("landed")
        return(

            <h2>Landed</h2>
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
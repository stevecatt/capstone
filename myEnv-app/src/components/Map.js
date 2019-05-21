import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {Marker} from 'react-map-gl';
import { MAPBOX_TOKEN } from "../.env.json";
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/actionTypes'

class Map extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 29.0,
      longitude: -95.0,
      zoom:2
    },
    marker: []
  };




  componentDidMount() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
       
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        this.props.addedMarker(this.state.latitude,this.state.longitude)
      })
    }
  }

  handleClick=(e)=>{
    console.log(e,"we clicked here")
    let marklong = e.lngLat[0]
    let marklat =  e.lngLat[1]
    let marker = {
      long:marklong,
      lat:marklat
    }
    console.log(marker)
    this.setState({
      marker:this.state.marker.concat(marker)
    })
  }


  render() {

    let markerData = this.state.marker.map(data => {
      return (
        <Marker latitude={data.lat} longitude={data.long} offsetLeft={-20} offsetTop={-10}><img src='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'/></Marker>
      )
    })

    
    return (
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
        addedMarker: (lat,long) => dispatch({type:actionTypes.ADDED_MARKER,lat:lat,long:long})
        
      }
    }
    

export default connect(mapStateToProps,mapDispatchToProps)(Map)
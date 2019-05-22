import React, {Component} from '../../node_modules/react';
import * as urls from '../utils/urls'
import { CHINA_KEY } from "../.env.json";
import { connect } from "react-redux"
import * as actionTypes from '../store/actions/actionTypes'



class AirQuality extends Component{

    constructor(){
        super()
        this.state={
            aqi:0,
            no2:0
           
           

        }

    }

    homeFetched = ()=>{
        let lat = 29.761345199999997
        let long =  -95.47930579999999
        let url = "https://api.waqi.info/feed/geo:"+lat+";"+long+"/?token="+CHINA_KEY
        fetch(url)
        .then(response => response.json())
        .then((json)=>{
            console.log("this is from China",json)
            this.props.onHomeAirQualityRecieved(json)
            console.log(json.data.aqi)
            console.log(json.data.iaqi.no2.v)
            this.setState({
                no2:json.data.iaqi.no2.v,
                aqi:json.data.aqi
                
            })
        })
        
    }

    componentDidMount (){
        this.homeFetched()
        
    }


    render(){
        return(
            <div>
                <h1>Air Quality</h1>
                <p>{this.state.aqi}</p>
                
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
      onHomeAirQualityRecieved: (airQuality)=> dispatch({type:actionTypes.AIR_QUALITY, airQuality:airQuality})
    }
  }
  

export default connect(mapStateToProps,mapDispatchToProps)(AirQuality)
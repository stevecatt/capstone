import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {Marker} from 'react-map-gl';
import { MAPBOX_TOKEN } from "../.env.json";
import { CHINA_KEY } from "../.env.json";
import { WEATHER_KEY } from "../.env.json"
//import { AIR_KEY } from "../.env.json"
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/actionTypes'
import axios from 'axios'
import * as urls from '../utils/urls'

//import Weather from './Weather'
import {Table,Button,Row, Card, Col,PopoverHeader,PopoverBody,Container} from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';




class Keycolors extends Component {
    constructor(){
        super()
        this.state={
            isGoodMouse:false,
            isModerateMouse:false,
            isUnhealthyMouse:false,
            isUhgMouse:false,
            isHazardousMouse:false,
            isVeryMouse:false

        }
    }

onGoodMouseIn =()=>{
    console.log('good mouse')
    this.setState({
        isGoodMouse:true
    })
   
    }


onModerateMouseIn =()=>{
    console.log("moderate mouse")
    this.setState({
        isModerateMouse:true
    })
  }
  onUhgMouseIn =()=>{
    console.log("uhg mouse")
    this.setState({
        isUhgMouse:true
    })
  }
  onHazardousMouseIn =()=>{
    console.log("hazardous")
    this.setState({
        isHazardousMouse:true
    })
  }
  onVeryMouseIn=()=>{
    console.log("very unhealthy")
    this.setState({
        isVeryMouse:true
    })
  }
  onUnhealthyMouseIn=()=>{
    console.log("unhealthy")
    this.setState({
        isUnhealthyMouse:true
    })
  }   
  onMouseIn =(key)=>{
    console.log(key)
    this.setState({
      mouseOverId :key,
      isHovering:true
      
    })

   //console.log("what the foo")
  }

  onMouseOut =()=>{
    this.setState({
        isGoodMouse:false,
        isModerateMouse:false,
        isUnhealthyMouse:false,
        isUhgMouse:false,
        isHazardousMouse:false,
        isVeryMouse:false
      
    })

   //console.log("what the foo")
  }
    render(){
        

        return (
    <Col className="health-warnings">   
    <Row>
        
    <div className="code-buttons">
    <button className="green button-margin" onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onGoodMouseIn()}>Good</button>
    <button className="yellow button-margin" onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onModerateMouseIn()}>Moderate</button>
    <button className="orange button-margin" onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onUhgMouseIn()}>UHG</button>
    <button className="red button-margin"  onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onUnhealthyMouseIn()}>Unhealthy</button>
    <button className="purple button-margin" onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onVeryMouseIn()}>Very Unhealthy</button>
    <button className="gonna-die button-margin" onMouseLeave={()=>this.onMouseOut()} onMouseEnter={()=>this.onHazardousMouseIn()}>Hazardous</button>
    
    </div>
    </Row>
    <Row>
    <Col className="popout-boxes">
      {this.state.isGoodMouse===true?
      <span className="green warning-box">
      <strong>AQI Good: 0-50</strong>
      <br/>
      Air quality is considered satisfactory, and air pollution poses little or no risk.
      </span>:null} 
      {this.state.isModerateMouse===true?
      <span className="yellow warning-box">
      <strong>AQI Moderate: 51-100</strong>
      <br/>
      Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.
      </span>:null}     
      {this.state.isUhgMouse===true?
      <span className="orange warning-box">
      <strong>AQI Unhealthy for Sensitive Groups: 101-150</strong>
      <br></br>
      Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air.
      
      </span>:null}     
      {this.state. isUnhealthyMouse===true?
      <span className="red warning-box">
      <strong>AQI Unhealthy: 151-200</strong>
      Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.
      </span>:null}     
      {this.state.isVeryMouse===true?
      <span className="purple warning-box">
      <strong>AQI Very Unhealthy: 200-300</strong>
      <br></br>
      Health alert: everyone may experience more serious health effects.
      </span>:null}     
      {this.state.isHazardousMouse===true?
      <span className="gonna-die warning-box">
      <strong>AQI Hazardous: 300-500</strong>
      <br></br>
      Health warnings of emergency conditions. The entire population is more likely to be affected.
      </span>:null}   
      

      </Col> 
      </Row>
      </Col>     
            
    

    

    )
}

}

export default Keycolors
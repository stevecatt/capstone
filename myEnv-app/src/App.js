import React,{Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Mapbox from './components/Mapbox'
//import MapContainer from './components/GoogleMap'
//import GoogleMapsContainer from './components/TestMap'

import 'mapbox-gl/dist/mapbox-gl.css';
//import Weather from './components/Weather';
import LandingPage from './components/LandingPage';


class App extends Component {

  

  render() {
    return (
      <div>
        
        
        <LandingPage/>
        <Mapbox>Mapbox</Mapbox>
        
        
       
       
      
       
      </div>
    )
  }

}

export default App;

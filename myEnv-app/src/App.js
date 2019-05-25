import React,{Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Map from './components/Map'
import MapContainer from './components/GoogleMap'
//import GoogleMapsContainer from './components/TestMap'

import 'mapbox-gl/dist/mapbox-gl.css';
import Weather from './components/Weather';


class App extends Component {

  

  render() {
    return (
      <div>
        
        
        
        <Map>Mapbox</Map>
        
        
       
       
      
       
      </div>
    )
  }

}

export default App;

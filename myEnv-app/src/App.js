import React,{Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Map from './components/Map'

import 'mapbox-gl/dist/mapbox-gl.css';


class App extends Component {

  

  render() {
    return (
      <div>
        
        App
        <Register>Register</Register>
        <Login>login</Login>
        <Map></Map>
       
      
       
      </div>
    )
  }

}

export default App;

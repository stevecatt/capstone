import React, {Component} from '../../node_modules/react';

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { GOOGLE_KEY } from "../.env.json";

export class MapContainer extends Component {
    render() {
      console.log(this.props.google)
      return (
        <Map google={this.props.google} zoom={10}>
  
          <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />
  
          <InfoWindow onClose={this.onInfoWindowClose}>
              <div>
                <h1>MAPS FROM GOOGLE</h1>
              </div>
          </InfoWindow>
        </Map>
      );
    }
  }
  // const Marker = props => {
  //   return <div className="SuperAwesomePin"></div>
  // }
  export default GoogleApiWrapper({
    apiKey: GOOGLE_KEY
  })(MapContainer)
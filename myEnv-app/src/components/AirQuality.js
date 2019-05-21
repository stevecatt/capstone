import React, {Component} from '../../node_modules/react';
import * as urls from '../utils/urls'



class AirQuality extends Component{

    countriesFetched = ()=>{

        fetch(urls.nearMe)
        .then(response => response.json())
        .then((json)=>{
            console.log(json)
        })
        
    }

    componentDidMount (){
        this.countriesFetched()

    }


    render(){
        return(
                <h1>air</h1>
        )
    }
}

export default AirQuality
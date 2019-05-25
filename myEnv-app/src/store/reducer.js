import * as actionTypes from './actions/actionTypes'


const initialState = {
   
    isAuthenticated:false,
   
    uid:0,
    latitude:0,
    longitude:0,
    homeWeather:{}
    
  }
  
  const reducer = (state = initialState, action) => {
  
    switch(action.type) {
      
        case actionTypes.IS_AUTHENITCATED:
        return{
          ...state,
          isAuthenticated: action.token != null ? true : false,
          uid:action.uid
        }
       
        case actionTypes.LOGOUT:
        return{
          ...state,
          isAuthenticated: false
        }

        case actionTypes.ADDED_HOME:
        return{
          ...state,
          latitude:action.lat,
          longitude:action.long
        }
        case actionTypes.WEATHER_FETCHED:
        return{
          ...state,
          homeWeather: action.weather
        }
        case actionTypes.ADDED_MARKER:
        return{
          ...state,
          marker:action.marker
        }
        
        

    }
  
    return state
  }
  
  export default reducer
  
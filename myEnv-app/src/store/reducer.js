import * as actionTypes from './actions/actionTypes'


const initialState = {
   
    isAuthenticated:false,
   
    uid:0,
    latitude:0,
    longitude:0
    
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

        case actionTypes.ADDED_MARKER:
        return{
          ...state,
          latitude:action.lat,
          longitude:action.long
        }
        
        

    }
  
    return state
  }
  
  export default reducer
  
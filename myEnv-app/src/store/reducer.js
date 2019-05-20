import * as actionTypes from './actions/actionTypes'

const initialState = {
    test:[],
    isAuthenticated:false,
}

const reducer = (state = initialState, action) =>{
    switch(action.type){
    case actionTypes.IS_AUTHENITCATED:
        return{
          ...state,
          isAuthenticated: action.token != null ? true : false,
          uid:action.uid
        }

    case 'LOGOUT':
        return{
          ...state,
          isAuthenticated: false
        }

    }
    
    return state 
}

export default reducer
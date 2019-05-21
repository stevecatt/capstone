import { AIR_KEY} from "../.env.json";


// export const removeFavorite = 'https://scorestracker.herokuapp.com/remove-favorite'
// export const saveFavorite = 'https://scorestracker.herokuapp.com/save-favorite'
// export const login = 'https://scorestracker.herokuapp.com/login'
// export const register = 'https://scorestracker.herokuapp.com/register'
// export const getFavorites = 'https://scorestracker.herokuapp.com/get-favorites'



export const removeFavorite = 'http://localhost:8080/remove-favorite'
export const saveFavorite = 'http://localhost:8080/save-favorite'
export const login = 'http://localhost:8080/login'
export const register = 'http://localhost:8080/register'
export const getFavorites = 'http://localhost:8080/get-favorites'
export const saveBackup = 'http://localhost:8080/apisc'

export const countries = 'https://api.airvisual.com/v2/countries?key='+AIR_KEY
export const nearMe = "https://api.airvisual.com/v2/nearest_city?key="+AIR_KEY
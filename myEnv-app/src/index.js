import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import { setDefaultBreakpoints } from 'react-socks';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from './store/reducer'
import thunk from 'redux-thunk'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import BaseLayout from './components/BaseLayout'
import requireAuth from './components/requireAuth'
import { setAuthenticationHeader } from './utils/authenticate'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import 'bootstrap/dist/css/bootstrap.min.css'
//import Weather from './components/Weather';
import LandingPage from './components/LandingPage';
import Mapbox from './components/Mapbox';


setAuthenticationHeader(localStorage.getItem('jwtoken'))

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer,composeEnhancers(
    applyMiddleware(thunk)
  ));

ReactDOM.render(

<Provider store={store}>
    <BrowserRouter>
        <BreakpointProvider>
            <BaseLayout>
                <Switch>
                    <Route path="/" exact component={LandingPage}/>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    
                    <Route path ="/userpage" component={Mapbox}/>
                    
                   
                    <Route path="/logout" component={Logout}/>
                  
                </Switch>
            </BaseLayout>
        </BreakpointProvider>
    </BrowserRouter>
</Provider>   

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
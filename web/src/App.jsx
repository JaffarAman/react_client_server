import React, { useEffect } from 'react'
import SignUpScreen from './Screen/SignUpScreen'
import "./maincssFile.css"
import PrivateRoute from "./config/routes"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LogIn from './Screen/LogIn';
import  DashboardScreen from "./Screen/DashboardScreen"
import ProfileScreen from './Screen/ProfileScreen';
import axios from 'axios';
import { BASE_URI } from './core';
const App = () => {
    
    useEffect(async () => {
        await axios.get(`${BASE_URI}/api/v1/profile` , {withCredentials : true})
        .then(res=>console.log( "HELLO ", res))
        .catch(err=>console.log(err))
        console.log("HELLO WORLD");
    }, [])

    return (
        <>
            <Router>
            <Switch>
        
                <Route  path="/signup"  component={SignUpScreen} />
                
                
                <Route exact path="/" component={LogIn} />
                
                <PrivateRoute component={DashboardScreen} exact path="/dashboard" />
                <PrivateRoute component={ProfileScreen} exact path="/profile" />
                {/* <Route exact path="/dashboard" component={DashboardScreen} /> */}
            
            </Switch>
            </Router>
                
        </>
    )
}

export default App

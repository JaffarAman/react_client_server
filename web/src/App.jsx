import React, { useEffect } from 'react'
import SignUpScreen from './Screen/SignUpScreen'
import "./maincssFile.css"
import PrivateRoute from "./config/routes"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LogIn from './Screen/LogIn';
import  DashboardScreen from "./Screen/DashboardScreen"
import ProfileScreen from './Screen/ProfileScreen';
import axios from 'axios';
import { BASE_URI } from './core';
import { useDispatch } from 'react-redux';
import { LoginActions } from './Redux';
import ImageCheck from './Components/ImageCheck';
const App = () => {
    const dispatch = useDispatch()
    
    useEffect(async () => {
        await axios.get(`${BASE_URI}/api/v1/profile` , {withCredentials : true})
        .then(res=>{
            console.log("hello",res)
            dispatch(LoginActions.LoginAction(res.data))
        })
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

                <Route path="/image" component={ImageCheck} />
                <Route  path="*">
                    <Redirect to="/" />
                </Route>
                {/* <Route exact path="/dashboard" component={DashboardScreen} /> */}
            
            </Switch>
            </Router>
                
        </>
    )
}

export default App

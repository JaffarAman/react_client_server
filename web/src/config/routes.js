import React from 'react'
import { Route , Redirect } from 'react-router-dom'
import {useSelector} from "react-redux"
import SplashScreen from '../Screen/SplashScreen'


const PrivateRoute = ({component:Component , ...rest}) => {
     const userData = useSelector(state => state.LoginReducer)
     console.log("private route data" , userData)
     return( 
          
           <Route render={(props)=>{
            return localStorage.getItem("data") ?
            <Component {...props} />
             : <Redirect to="/" />  
             
        }} /> 
            )

}

export default PrivateRoute

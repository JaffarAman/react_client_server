import React, { useState } from 'react'
import NavbarApp from '../Components/DashBoardCmp/Navbar'
import {useSelector} from "react-redux"
import styles from "./ProfileScreen.module.css"
import SplashScreen from './SplashScreen'
import { FaUserAlt } from 'react-icons/fa'
import { useHistory } from 'react-router'
const ProfileScreen = () => {
    const [icon , setIcon] = useState("fas fa-sun")
    const [darkTheme , setDarkTheme] = useState(false)
    const userData = useSelector(state => state.LoginReducer)
    const history = useHistory()
    console.log("PROFILE SCREEN" , userData)
    console.log("userData" , userData);
    const changeTheme = ()=>{
        if(!darkTheme){
          setIcon("fas fa-moon")
           setDarkTheme(true)
    
        }else{
          setIcon("fas fa-sun")
          setDarkTheme(false)
    
        }
       }
    return (
        <div>
            <NavbarApp icon={icon} changeTheme={changeTheme}/>
            
            <section className={styles.profileMainBox} style={{backgroundColor : darkTheme ? "#343a40" : '#E0EAFC' , color : darkTheme ? "white" : "black"  }}>


                   {userData?.emailAddress ?
                    <div className={styles.profileBox}>
                       
                        <div className={styles.userNameHead} >
                            <small>

                            <FaUserAlt />
                            </small>
                            <h1>{userData.firstName}</h1>
                        </div>

                        <div className={styles.userDetails} >
                            <ul>

                            <li>
                                <small>First Name :</small>
                                {userData.firstName}</li>
                            <li>
                            <small>Last Name  :</small>
                            {userData.lastName}</li>
                            <li>
                            <small>Email Address :</small>
                                
                                {userData.emailAddress} </li>
                            <li>
                            <small>Password : </small>

                            {userData.password}</li>
                            </ul>
                        </div>
                        <div className={styles.profilebtns}>

                        <button className={styles.profilebtnsFC} onClick={()=>history.push("/")}>Dashboard</button>
                        <button className={styles.profilebtnsLC}>Edit</button>

                        </div>

                    </div> :
                        <SplashScreen /> 
                            

}

            </section>


        </div>
    )
}

export default ProfileScreen

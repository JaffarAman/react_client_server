import React from 'react'
import NavbarApp from '../Components/DashBoardCmp/Navbar'
import {useSelector} from "react-redux"
const ProfileScreen = () => {
    const userData = useSelector(state => state.LoginReducer)
    console.log("PROFILE SCREEN" , userData)
    
    return (
        <div>
            <NavbarApp />
            
            

        </div>
    )
}

export default ProfileScreen

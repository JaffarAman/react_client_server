import axios from 'axios'
import React from 'react'
import { Navbar , Nav} from "react-bootstrap"
import { useHistory } from 'react-router'
import { BASE_URI } from '../../core'
const NavbarApp = ({icon, changeTheme}) => {
  const history = useHistory()
  const logout =()=>{
      
      axios.post(`${BASE_URI}/api/v1/logout` , {},{withCredentials : true})
      .then(res=>console.log( "LOGOUT",res))
      .catch(err=>console.log(err))
      
      
      localStorage.removeItem("data")
      // history.replace('/')
  }
  const profile =()=>{
    history.replace('/profile')
}
const home =()=>{
  history.replace('/dashboard')
}

  return (
        <div>
            <Navbar style={{backgroundColor : "#09DEEA"}} expand="lg">
  <Navbar.Brand href="#home">Carrier <del>Carrer</del> </Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
      
      <Nav.Link href="javascript:void()">
        <i className={icon} onClick={()=>changeTheme()} ></i>
      </Nav.Link>
      <Nav.Link href="javascript:void()" onClick={()=>home()}>
        Home
        </Nav.Link>
      <Nav.Link href="javascript:void()" onClick={()=>profile()}>Profile</Nav.Link>
      <Nav.Link href="javascript:void()" style={{width:"80px"}} className="bg bg-dark text-center rounded text-white" onClick={()=>logout()}>
        
        Logout
        
        </Nav.Link>
  
    </Nav>
    
  </Navbar.Collapse>
</Navbar>
        </div>
    )
}

export default NavbarApp

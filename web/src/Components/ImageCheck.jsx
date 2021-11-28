import axios from 'axios'
import React from 'react'
import { BASE_URI } from '../core'

const ImageCheck = () => {
    const handleImageChange =(e)=>{
        // console.log(e.target.files[0])
        const imageFile = e.target.files[0]
        let formData = new FormData()
        formData.append("imageFile" , imageFile )
        formData.append("userName" , "jaffar" )
        formData.append("details" , JSON.stringify({
            subject : "postPic",
            year : "2021"
        }) )
        // console.log("formData", formData)
    
        axios({
            method:"post",
            url : `${BASE_URI}/upload`,
            data:formData,
            header : {'Content-Type': 'multipart/form-data'},
            withCredentials : true
        })
        .then(res=>{
            console.log("success upload" , res)
        })
        .catch(err=>console.log(err))
    }
    return (
        <div>
            
            <input type="file" onChange={handleImageChange} />

            <button>upload image</button>

        </div>
    )
}

export default ImageCheck

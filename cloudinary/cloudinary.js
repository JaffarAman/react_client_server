var cloudinary = require("cloudinary")
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key:  process.env.CLOUDINARY_CLOUD_API , 
    api_secret:  process.env.CLOUDINARY_CLOUD_SECRET ,
    secure: true
 });
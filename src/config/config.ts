import {config as conf } from 'dotenv'

conf();


const _config = {          // _ is used for private variable
    port: process.env.PORT,
    databaseURL : process.env.MONGO_URL,
    env: process.env.NODE_ENV,
    JWT : process.env.JWT_SECRET,
    cloud_name : process.env.CLOUDINARY_CLOUD,
    cloud_api : process.env.CLOUDINARY_API_KEY,
    cloud_api_secret : process.env.CLOUDINARY_API_SECRET

}               

export const config = Object.freeze(_config)  //freeze is used for converting variable into read-only
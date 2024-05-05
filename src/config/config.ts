import {config as conf } from 'dotenv'

conf();


const _config = {          // _ is used for private variable
    port: process.env.PORT,
    databaseURL : process.env.MONGO_URL,
}               

export const config = Object.freeze(_config)  //freeze is used for converting variable into read-only
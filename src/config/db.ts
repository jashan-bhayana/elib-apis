import mongoose, { mongo } from 'mongoose'
import { config } from './config'

const connectDB = async () =>{
    try{
        mongoose.connection.on("connected" , () => {
            console.log("Connection to DB is successful");
        });
         //After initial connection what if there is error afterwards
        mongoose.connection.on('error', (err)=>{
            console.log("error in connecting to DB" , err)
        })

        await mongoose.connect(config.databaseURL as string)

    }
    catch(err){
        console.log("Failed to connect to Database",err);
        process.exit(1)
    }
}

export default connectDB
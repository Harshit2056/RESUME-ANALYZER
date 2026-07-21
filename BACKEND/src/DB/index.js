import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("DB is connected!!!")
    }
    catch(error){
        console.log("DB is not connected!!!",error)
        process.exit(1);
    }
    
}

export default connectDB;
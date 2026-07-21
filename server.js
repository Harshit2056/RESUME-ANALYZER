import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/db/index.js";
import app from "./app.js";

const server = express();
const port = process.env.PORT || 4000;

dotenv.config({
    path:"./.env"
});

connectDB()

.then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log(`my server is running on: ${port}` )
    });
})

.catch((error)=>{
    console.log("server is not running!!!!",error)
})
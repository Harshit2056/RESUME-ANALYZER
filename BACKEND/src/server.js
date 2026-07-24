import express from "express"
const server = express();
const port = process.env.PORT || 4000;


import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
});

import connectDB from "./db/index.js";
import app from "./app.js";

await connectDB()
  
import generateInterviewReport from "./services/ai.service.js";
import {resume,selfDescription,jobDescription }from "./services/temp.js"

generateInterviewReport({selfDescription, jobDescription, resume})

.then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log(`my server is running on: ${port}` )
    });
})

.catch((error)=>{
    console.log("server is not running!!!!",error)
})
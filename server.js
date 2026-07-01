import express from "express"
import dotenv from "dotenv"

const server = express();
const port = process.env.PORT || 4000;

dotenv.config({
    path:"./.env"
});


server.listen(port,()=>{
    console.log(`my server is running on: ${port}` )
})
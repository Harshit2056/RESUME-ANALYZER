
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 4000;

import connectDB from "./db/index.js";
import app from "./app.js";

await connectDB()
  

.then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log(`my server is running on: ${port}` )
    });
})

.catch((error)=>{
    console.log("server is not running!!!!",error)
})
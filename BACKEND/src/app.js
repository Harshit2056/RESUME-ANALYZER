import { urlencoded } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app= express();


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true 
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))

import authRouter from "./Routes/auth.route.js";
import { interviewRouter } from "./routes/interview.route.js";

app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter)


export default app;
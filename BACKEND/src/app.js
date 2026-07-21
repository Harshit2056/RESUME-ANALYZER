import { urlencoded } from "express";
import express from "express";
import cookieParser from "cookie-parser";

const app= express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

import authRouter from "./src/Routes/auth.route.js";

app.use("/api/auth",authRouter);

export default app;
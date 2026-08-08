import { urlencoded } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app= express();


const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))

import authRouter from "./routes/auth.route.js";
import { interviewRouter } from "./routes/interview.route.js";

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "GenAI Resume & Mock Interview API is running smoothly."
    });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;
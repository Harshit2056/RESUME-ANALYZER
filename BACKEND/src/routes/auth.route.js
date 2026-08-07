import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyJWT, logoutUser);

authRouter.route("/current-user").get(verifyJWT, getCurrentUser);

authRouter.route("/forgot-password").post(forgotPassword);

authRouter.route("/reset-password/:token").post(resetPassword);

export default authRouter;
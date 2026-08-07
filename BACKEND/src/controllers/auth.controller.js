import { tokenBlacklistModel } from "../models/blacklist.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import crypto from "crypto";
import sendEmail from "../services/mail.service.js";



const generateAccessAndRefreshToken = async(userId)=>{

    try {
        const user = await User.findById(userId)
        const accessToken =await user.generateAccessToken(userId)
        const refreshToken = await user.generateRefreshToken(userId)
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    
        return { accessToken,refreshToken };
    } catch (error) {
        throw new apiError(500,"something went wrong while generating access and refresh token")
    }
};

const registerUser= asynchandler(async(req,res)=>{

    console.log("req.body=>",req.body)
    
    const{username,email,password} = req.body
    
    if(!username || !password || !email){
        throw new apiError(400,"required field missing")
    }

    const existeduser = await User.findOne({
        $or:[{username:username},
            {email:email}
        ]
    })

    if(existeduser){
        throw new apiError(409,"user already existed")
    }

    const user =await User.create({
        username:username.toLowerCase(),
        email,
        password
    })

    return res
    .status(201)
    .json(
        new apiResponse(201,{user},"user registered succesfully")
    )
});

const loginUser = asynchandler(async(req,res)=>{
    const{username,email,password}= req.body;

    if(!(username || email)){
        throw new apiError(400,"username and email is required")
    }

    const user = await User.findOne({ 
        $or:[{username},{email}]
    })

    if(!user){
        throw new apiError(400,"username or email is invalid")
    }

    const isPasswordCorrect =await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new apiError(400,"entered password is wrong")
    }

    const {refreshToken,accessToken} =await generateAccessAndRefreshToken(user._id)

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    };

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new apiResponse(
        200,
        {LoggedInUser},
        "user login successfully!"
    ))
});

const logoutUser = asynchandler(async (req,res)=>{

    if (req.token) {
        await tokenBlacklistModel.create({token:req.token});
    }

    if (req.user?._id) {
        await User.findByIdAndUpdate(
            req.user._id,
            {$unset:{refreshToken:1}},
        );
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    };

    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new apiResponse(
        200,{},"logout successfully"
    ))
});

const getCurrentUser = asynchandler(async(req,res)=>{
    
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.user,
        "current user fetched successfully"
    ))
});

const forgotPassword = asynchandler(async(req,res)=>{

    const { email } = req.body;

    if(!email?.trim()){
        throw new apiError(400,"Email is required")
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        throw new apiError(404, "User not found with this email address");
    }

    const resetToken = user.generateResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetURL = `${clientBaseUrl}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
                    <h2 style="color: #6366f1;">GenAI Resume &bull; Password Reset</h2>
                    <p style="color: #333333; font-size: 14px;">We received a request to reset your password. Click the button below to set a new password:</p>
                    <div style="margin: 25px 0;">
                        <a href="${resetURL}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666666; font-size: 12px;">This reset link will expire in 15 minutes.</p>
                    <p style="color: #999999; font-size: 11px; margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
                </div>
            `
        });
    }
    catch(err){
        console.error("Nodemailer sendMail Error:", err);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new apiError(500, `Email could not be sent: ${err.message}`);
    }

    return res.status(200).json(
        new apiResponse(200, {}, `Password reset email sent to ${user.email}`)
    );
});

const resetPassword = asynchandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        throw new apiError(400, "Password must be at least 6 characters long");
    }

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new apiError(400, "Invalid or expired reset password token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json(
        new apiResponse(200, {}, "Password updated successfully. You can now log in.")
    );
});


export { registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        forgotPassword,
        resetPassword };       

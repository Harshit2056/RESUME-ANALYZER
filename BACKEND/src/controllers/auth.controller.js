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
    
    const{username,email,password} = req.body
    
    if(!username || !password || !email){
        throw new apiError(400,"required field missing")
    }

    const existeduser = await User.findOne({
        $or: [
            { username: username.toLowerCase().trim() },
            { email: email.toLowerCase().trim() },
            { email: { $regex: new RegExp(`^${email.toLowerCase().trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, "i") } }
        ]
    });

    if(existeduser){
        throw new apiError(409,"user already existed")
    }

    const user =await User.create({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
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

    const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
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

    const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
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

    const user = await User.findOne({
        $or: [
            { email: email.trim().toLowerCase() },
        ]
    });

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
            subject: "Password Reset Request - GenAI Resume",
            text: `Hi ${user.username},\n\nYou requested a password reset for your GenAI Resume account. Please click the link below to set a new password:\n\n${resetURL}\n\nThis link will expire in 15 minutes. If you did not request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #4f46e5; margin-top: 0;">GenAI Resume &bull; Password Reset</h2>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hi <strong>${user.username}</strong>,</p>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6;">We received a request to reset the password for your GenAI Resume account. Click the button below to set a new password:</p>
                    <div style="margin: 28px 0; text-align: center;">
                        <a href="${resetURL}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(79,70,229,0.2);">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #64748b; font-size: 12px; line-height: 1.5;">Or copy and paste this link into your browser:<br/><a href="${resetURL}" style="color: #4f46e5; word-break: break-all;">${resetURL}</a></p>
                    <p style="color: #94a3b8; font-size: 11px; margin-top: 24px; border-t: 1px solid #f1f5f9; padding-top: 16px;">This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
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

import { tokenBlacklistModel } from "../models/blacklist.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asynchandler from "../utils/asynchandler.js";

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
        httpOnly:true,
        secure:true
    }

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

    await tokenBlacklistModel.create({token:req.token})

    await User.findOneAndUpdate(
        req.user._id,
        {$unset:{refreshToken:1}},
    )

    const options = {
        httpOnly:true,
        secure:true
    }

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

export { registerUser,
        loginUser,
        logoutUser,
        getCurrentUser };
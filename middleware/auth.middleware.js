import { tokenBlacklistModel } from "../src/models/blacklist.model.js";
import { User } from "../src/models/user.model.js";
import apiError from "../src/utils/apiError.js";
import apiResponse from "../src/utils/apiResponse.js";
import asynchandler from "../src/utils/asynchandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asynchandler(async(req,res,next)=>{

    try {
        
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new apiError(401,"unauthorized request")
        }

        const isTokenBlackListed = await tokenBlacklistModel.findOne({token:token})

        if(isTokenBlackListed){
            return res.status(401).json(new apiResponse(401,{},"token is not valid"))
        }
        
        req.token = token;
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_CODE)
    
        const user = await User.findById(decodedToken.userId).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(401,"invalid access token")
        }
    
        req.user = user
        next();
    } catch (error) {
        throw new apiError(401,error.message)
    }
})

export {verifyJWT};


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true,"this username is already existed"]
    },

    password:{
        required:true,
        type:String,
    },

    email:{
        required:true,
        unique:[true,"this email address is already taken"],
        type:String
    },
    refreshToken: {
        type: String
    }
},{timestamps:true})

userSchema.pre("save",async function (){
    if(!this.isModified("password")){
        return;
    }

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        userId : this._id,
        password: this.password,
        email: this.email
    } ,
    process.env.ACCESS_TOKEN_SECRET_CODE,
    {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET_CODE,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

export const User = mongoose.model("User",userSchema)
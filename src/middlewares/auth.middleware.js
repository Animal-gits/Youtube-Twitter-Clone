import jwt from 'jsonwebtoken'
import { ApiError } from '../helpers/ApiError.js';
import { User } from '../models/user.model.js';

const protect = async (req , _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer " , "")
        if(!token){
            throw new ApiError(404 , "Not Authorized . Token Failed !")
        }

        const decoded = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        if(!decoded){
            throw new ApiError(404 , "Not Authorized . Token Faild !")
        }

        const user = await User.findById(decoded._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(404 , "Not Authorized . Token Failed !")
        }

        req.user = user
        next()
    } catch (error) {
        throw new Error(400 , "Not Authorized . Token Failed!!" || error.message)
    }
}

export {protect}
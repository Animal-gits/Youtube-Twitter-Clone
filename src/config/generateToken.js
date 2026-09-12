import { ApiError } from '../helpers/ApiError.js';
import {User} from '../models/user.model.js'


const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
    
        return accessToken
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating Access Token" || error.message)
    }
}

const generateRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    } catch (error) {
        throw new ApiError(500 , "Something wong happened while generating Refresh Token" || error.message)
    }
}

export {generateAccessToken , generateRefreshToken}
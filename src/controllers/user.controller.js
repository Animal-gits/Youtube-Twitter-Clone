import {asyncHandler} from '../helpers/asyncHandler.js'
import {ApiError} from '../helpers/ApiError.js'
import {ApiResponse} from '../helpers/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.service.js';
import {User} from '../models/user.model.js'
import {generateAccessToken , generateRefreshToken} from '../config/generateToken.js'
import jwt from 'jsonwebtoken'


const registerUser = asyncHandler(async (req , res) => {
    console.log("Register User Controller Starting")

    const {fullName , email , username , password} = req.body

    if(
        [fullName , email , username , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.fineOne({
        $or : [{username } , {email}]
    })

    if (existedUser) {
        throw new ApiError(400 , "User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    if(!avatarLocalPath){
        throw new Error(400 , "Avatar is required")
    }

    let coverLocalPath 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0){
        coverLocalPath = req.files.coverImage[0].path
    }

    const avatar = uploadOnCloudinary(avatarLocalPath)
    const coverImage = uploadOnCloudinary(coverLocalPath)

    if(!avatar){
        throw new ApiError(400 , "Avatar is required")
    }

    const user = User.create({
        fullName,
        password,
        username : username.toLowerCase(),
        email,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(400 , "Error occured in resgistering your acccount")
    }else{
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
    }
})

const loginUser = asyncHandler(async (req , res) => {
    console.log("Login Controller got started")

    const {username  , email , password} = req.body

    if(
        [userame , email , password].some((field) => field?.trim() === "")
    ){
        throw new Error(400 , "Enter all the fields")
    }

    const user = await User.findOne({
        $or : [{email} , {username}]
    })

    if(!user){
        throw new ApiError(404 , "Invalid User Credentials")
    }

    const isPasswordCorrect = await user.matchPassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(404 , "Invalid User Credentials")
    }

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    /*hum ek baar aur user ko again iss liye call ker rhy hain kyunke jo pichla hai uske pass password aur refreshtoken hoga jo hum nhi bhejna chahte frontend pe
    mager humme password chaye usse verify kerny ky liye isliye dobara new fresh user fetch kiya jayga*/
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const cookieOptions = {
        httpOnly : true,
        secure : true
    }
    if(!loggedInUser){
        throw new ApiError(400 , "Invalid Credentials")
    }else{
        return res
        .cookie("accessToken" , accessToken , cookieOptions)
        .cookie("refreshToken" , refreshToken , cookieOptions)
        .status(200)
        .json(
            new ApiReponse(
                200,
                loggedInUser,
                "User Logged in successfully"
            )
        )
    }

})

const logoutUser = asyncHandler(async(req , res) => {
    const loggedOutUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken")

    const cookiesOptions = {
        httpOnly : true,
        secure: true
    }

    if(!loggedOutUser){
        throw new ApiError(400 , "User Logout Process Failed")
    }else{
        return res
        .clearCookies("accessToken" , cookiesOptions)
        .clearCookies("refreshToken" , cookiesOptions)
        .json(
            new ApiResponse(
                200 , 
                loggedOutUser,
                "User Logged Out Successfully"
            )
        )
    }
})

const refreshAccessToken = asyncHandler(async(req , res) =>{
    let incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    try {
        const decoded = jwt.verify(
            incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET
        )
        if(!decoded){
            throw new ApiError(400 , "Not Authorized . Token Failed!!")
        }

        const user = await User.findById(decoded?._id).select("-password")
        if(!user){
            throw new ApiError(404 , "Not Authorized . Token Failed!!")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(400 , "Not Authorized . Token Failed!!")
        }

        const accessToken = await generateAccessToken(user._id)
        const newRefreshToken = await generateRefreshToken(user._id)

        const cookiesOptions = {
            httpOnly : true,
            secure : true
        }
        
        return res
        .status(201)
        .cookie("refreshToken" , newRefreshToken , cookiesOptions)
        .cookie("accessToken" , accessToken , cookiesOptions)
        .json(
            new ApiResponse(
                200,
                {accessToken , refreshToken: newRefreshToken},
                "Access Token refreshed Successfully"

            )
        )

    } catch (error) {
        throw new ApiError(404 , "Not Authorized" || error.message)
    }
})

const changeUserPassword = asyncHandler(async (req , res) => {
    const {newPassword , oldPassword} = req.body

    const user = await User.findById(req.user._id)
    const isTruePassword = await user.matchPassword(oldPassword)
    if(!isTruePassword){
        throw new Error(400 , "Invalid Old Password")
    }

    if(isTruePassword){
        user.password = newPassword
        await user.save()
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , {} , "Password updated successfully")
        )

})

const getCurretnUser = asyncHandler(async (req , res) => {
    res
        .status(200)
        .json(
            new ApiResponse(200 , req.user , "User fetched successfully")
        )
})

const updateAccountDetails = asyncHandler(async (req ,res) => {
    const {fullName , email} = req.body
    if(!fullName || email){
        throw new ApiError(404 , "Enter all the fields")
    }

    const user = await User.findByIdAndUpdate({
        _id : req.user._id
    } , {
        $set : {
            fullName , 
            email
        }
    } , {
        new : true
    }).select("-password")

    if(!user){
        throw new ApiError(400 , "User detials not updated ! Try again")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , user , "User update successfully")
        )
})

const updateAvatarImage = asyncHandler(async (req , res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(404 , "Error while uploading")
    }

    const user = await User.findByIdAndUpdate({_id : req.user._id} , {
        $set : {
            avatar : avatar.url
        }
    } , {new : true}).select("-password")

    if(user){
        res
            .status(200)
            .json(
                new ApiResponse(200 , user , "Avatar image updated successfully")
            )
    }
})

const updateCoverImage = asyncHandler(async (req , res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400 , "Cover image not uploaded")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400 , "Error in uploading cover image")
    }

    const user = await User.findByIdAndUpdate({
        _id : req.user._id
    },{
        $set : {
            coverImage : coverImage.url
        }
    }, {
        new : true
    }).select("-password")

    if(user){
        res
        .res(200)
        json(
            new ApiResponse(200 , user  , "Cover image uploaded successfully" )
        )
    }

})

const getUserChannelProfile = asyncHandler(async (req , res) => {
    const {username} = req.params

    if(!username.trim()){
        throw new Error(400  , "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subcribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields : {
                subscribersCount : {
                    $size : "$subscribers"
                },
                subscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $cond :{
                    $if : {[req.user._id , "$subscribers.subscribe"]},
                    then : true , 
                    else : false
                    }
                }
            }
        },
        {
            $project : {
                username : 1,
                fullName : 1,
                subscribersCount : 1,
                subscribedToCount : 1,
                isSubscribed : 1,
                avatar : 1,
                coverImage : 1,
                email : 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(400 , "Channel does not exist")
    }

    res.status(200).json(
        new ApiResponse(200 , channel[0] , "Channel fetched successfully")
    )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurretnUser,
    updateAccountDetails,
    updateAvatarImage,
    updateCoverImage,
    getUserChannelProfile
}
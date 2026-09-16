import mongoose from "mongoose";
import { ApiError } from "../helpers/ApiError.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import {asyncHandler} from "../helpers/asyncHandler.js"
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";

const publishVideo = asyncHandler(async (req , res) => {
    const {title  , description} = req.body
    const videoLocalPath = req.files?.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path

    if(!videoLocalPath){
        throw new ApiError(400 , "Video file is missing")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400 , "Thumbnail is missing")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnailFile.url){
        throw new ApiError(400 ,"Error while uloading thumbnail")
    }

    if(!videoFile.url){
        throw new ApiError(400 , "Error while uploading video")
    }

    const videoData = {
        title ,
        description,
        videoFile : videoFile.url,
        thumbnail : thumbnailFile.url,
        owner : req.user._id,
        duration : videoFile.duration
    }

    const video = await Video.create(videoData)

    if(!video){
        throw new ApiError(400 , "Error in publishing video")
    }

    res
        .status(201)
        .json(
            new ApiResponse(201 , video , "Video published successfully")
        )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find().sort({createdAt : -1})
    res.status(200).json(
        new ApiResponse(200 , videos , "Video fetched successfully")
    )
})

const getVideoById = asyncHandler(async (req , res) => {
    const {videoId} = req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400 , "Failed to find video")
    }

    res 
        .status(200)
        .json(
            new ApiResponse(200 , video , "Video fethed successfully")
        )
})

export {
    publishVideo,
    getAllVideos,
    getVideoById
}
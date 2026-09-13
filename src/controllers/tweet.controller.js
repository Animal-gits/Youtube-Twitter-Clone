import mongoose from "mongoose";
import { ApiError } from "../helpers/ApiError.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import {asyncHandler} from "../helpers/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content || content.trim() === ""){
        throw new ApiError(400 , "Enter the tweet")
    }

    const tweet = await Tweet.create({
        content,
        owner : req.user._id
    })

    if(!tweet){
        throw new ApiError(400 , "Error while creating tweet . Please Try again!")
    }

    res
        .status(201)
        .json(
            new ApiResponse(200 , tweet , "Tweet created successfuly")
        )
})

const getUserTweets = asyncHandler(async (req , res) => {
    const {userId} = req.params

    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400 , "Invalid user Id")
    }

    const tweets = await Tweet.find({owner : userId})

    if(!tweets.length === 0){
        throw new ApiError(400 , "Error in fetching tweets")
    }

    res 
        .status(200)
        .json(
            new ApiResponse(200 , tweets , "Tweets fetched successfully")
        )
})

const getMyTweets = asyncHandler(async (req ,res) => {
    const tweets = await Tweet.find({owner : req.user._id})

    if(tweets.length === 0){
        throw new ApiError(400 , "Error in fetching tweets")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , tweets , "Your tweets fetched successfully")
        )
})


const updateTweet = asyncHandler(async (req , res) => {
    const {content} = req.body
    const {tweetId} = req.params

    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400 , "Invalid tweet Id")
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400 , "Enter something to update")
    }

    const tweet = await Tweet.findOneAndUpdate({
        _id : tweetId,
        owner : req.user._id
    } , {
        $set : {
            content
        }
    } ,{
        new :true
    })

/*  // Find tweet
const tweet = await Tweet.findById(tweetId);

THEN check owner
if (tweet.owner !== req.user._id) ...

Instead, MongoDB itself only finds the tweet if it belongs to the authenticated user.

That's a clean and very common backend pattern. */

    if(!tweet){
        throw new ApiError(200 , "Error in updating tweet")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , tweet , "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req , res) => {
    const {tweetId} = req.params
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400 , "Invalid tweet Id")
    }

    const tweet = await Tweet.findOneAndDelete({
        _id : tweetId,
        owner : req.user._id
    })

    if(!tweet){
        throw new ApiError(400 , "Error in deleting tweet")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , tweet , "Tweet deleted successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    getMyTweets,
    updateTweet,
    deleteTweet
}
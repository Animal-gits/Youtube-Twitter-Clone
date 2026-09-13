import { asyncHandler } from "../helpers/asyncHandler.js";
import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../helpers/ApiError.js";
import { ApiResponse } from "../helpers/ApiResponse.js";

const addComment = asyncHandler(async (req ,res) => {
    const {videoId} = req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "Invalid Video Id")
    }
    const {content} = req.body
        //check for whitespaces
    if(!content , content.trim() === ""){
        throw new ApiError(400 , "Enter the comment please")
    }

    const comment = await Comment.create({
        content,
        owner : req.user._id,
        videoId
    })

    if(!comment){
        throw new ApiError(400 , "Comment did not upload")
    }

    if(comment){
        res
            .status(201)
            .json(
                new ApiResponse(201 , comment , "Comment uploaded successfully" )
            )
    }

})

const getComments = asyncHandler(async (req , res) => {
    const {videoId} = req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "Invalid Video Id")
    }

    const comments = await Comment.find({videoId}).select("content")

    if(comments.length === 0){
        throw new ApiError(400 , "Could not find comments")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , comments, "Comments fetched succesfully")
        )
})

const updateComment = asyncHandler(async (req , res) => {
    const {commentId} = req.params

    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400 , "Invalid Comment Id")
    }
    const {content} = req.body

    if(!content || content.trim() === ""){
        throw new ApiError(400 , "Enter the comment please")
    }

    const comment = await Comment.findByOneAndUpdate(
        {
        _id : commentId,
        owner : req.user._id
        } , {
            content
        } ,{
            new : true
        })
    
    if(!comment){
        throw new ApiError(400 , "Error in updating comment . Try Again!")
    }

    res
        .status(201)
        .json(
            new ApiResponse(201 , comment , "Comment updated successfully")
        )

})


const deleteComment = asyncHandler(async (req , res) => {
    const {commentId} = req.params
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400 , "Invalid comment Id")
    }

    const comment = await Comment.findByOneAndDelete({
        _id : commentId,
        owner : req.user._id
        } )

    if(!comment){
        throw new ApiError(400 , "Error in deleting comment . Try Again!")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , comment , "Comment deleted successfully")
        )
})

export {
    addComment,
    getComments,
    deleteComment,
    updateComment
}
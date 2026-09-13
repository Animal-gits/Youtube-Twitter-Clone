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


export {
    addComment
}
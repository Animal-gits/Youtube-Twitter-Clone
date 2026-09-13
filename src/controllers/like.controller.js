import mongoose from "mongoose";
import { ApiError } from "../helpers/ApiError.js";
import {asyncHandler} from "../helpers/asyncHandler.js"
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../helpers/ApiResponse.js";


const toggleLike = asyncHandler(async (req , res) => {
    const {type , id} = req.params

    const toggleTypes = ["video" , "comment" , "tweet"]

    if(!toggleTypes.includes(type)){
        throw new ApiError(400 , "Invalid Like type")
    }

    if(!mongoose.isValidObjectId(id)){
        throw new ApiError(400 , "Invalid like Id")
    }

    const filter = {
        likedBy : req.user._id,
        [type] : id
    }

    const existingLike = await Like.findOne(filter)

    //like -> unlike

    if(existingLike){
        const unlike = await Like.findByIdAndDelete(existingLike._id)
        return res
                .status(200)
                .json(
                    new ApiResponse(200 , {isLiked : false , unlike} , `${type} unliked successfully`)
                )
    }

    // now , unlike -> like

    const like = await Like.create(filter)

    res.status(201).json(
        new ApiResponse(201 , {isLiked : true , like} , `${type} liked successfully`)
    )
})

export {
    toggleLike
}
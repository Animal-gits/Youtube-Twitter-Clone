import { ApiError } from "../helpers/ApiError.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import {asyncHandler} from "../helpers/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req , res) => {
    const {name , description} = req.body
    if(!name || name.trim() === ""){
        throw new ApiError(400 , "Enter Titl please")
    }

    if(!description || description.trim() === ""){
        throw new ApiError(400 , "Enter description please")
    }

    const playlist = await Playlist.create({
        name, 
        descriprion,
        owner : req.user._id,
        videos : []
    })

    if(!playlist){
        throw new ApiError(400 , "Playlist not created")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, playlist , "Playlist created successfully")
        )
})

export {
    createPlaylist,
}
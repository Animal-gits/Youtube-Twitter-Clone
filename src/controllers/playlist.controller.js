import mongoose from "mongoose";
import { ApiError } from "../helpers/ApiError.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import { asyncHandler } from "../helpers/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Enter Titl please")
    }

    if (!description || description.trim() === "") {
        throw new ApiError(400, "Enter description please")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    })

    if (!playlist) {
        throw new ApiError(400, "Playlist not created")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist created successfully")
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid Object Id")
    }

    const playlist = await Playlist.find({
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(400, "Failed to find playlist for user")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlists fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id")
    }

    const playlist = await Playlist.findById({
        playlistId
    })

    if (!playlist) {
        throw new ApiError(400, "Failed to get playlist")
    }

    res
        .status(200)
        .json(200, playlist, "Playlist fetched successfully")
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id")
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const playlist = await Playlist.findByIdAndUpdate({
        playlistId,
        owner: req.user._id
    }, {
        $addToSet: {
            videos: videoId
        }
    }, { new: true })

    if (!playlist) {
        throw new ApiError(400, "Failed to add video to playlist")
    }

    res
        .status(200)
        .json(200, playlist, "Successfully added video to playlist")
})

const removeVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id")
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const playlist = await Playlist.findByIdAndUpdate({
        playlistId,
        owner: req.user._id
    }, {
        $pull: {
            videos: videoId
        }
    }, {
        new: true
    })

    if (!playlist) {
        throw new ApiError(400, "Error in removing video from playlist")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video successfully removed from playlist")
        )
})

const deletePlaylist = asyncHandler(async (req , res) => {
    const {playlistId} = req.params

    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400 , "Invalid Playlist Id") 
    }
})

const updatePlaylist = asyncHandler(async (req,res) => {
    const {playlistId} = req.params
    const {name , description} = req.body

    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400 , "Invalid Playlist Id")
    }

    if(!name || name.trim() === ""){
        throw new ApiError(400 , "Enter the title to update")
    }

    if(!description || description.trim() === ""){
        throw new ApiError(400 , "Enter the description to update")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId , {
        $set : {
            title,
            description
        }
    } , {new : true})

    if(!playlist){
        throw new ApiError(400 , "Failed to update title and desciption")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , playlist , "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoToPlaylist,
    deletePlaylist,
    updatePlaylist
}
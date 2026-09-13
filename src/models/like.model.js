import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
    video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },
    comment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "comment"
    },
    tweet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tweet"
    },
    likedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} ,{timeseries : true})

const Like = mongoose.model("Like" , likeSchema)

export {Like}
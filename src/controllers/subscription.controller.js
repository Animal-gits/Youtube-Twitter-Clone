import mongoose from "mongoose";
import {Subscription} from "../models/subscription.model.js"
import { asyncHandler } from "../helpers/asyncHandler.js";
import { ApiError } from "../helpers/ApiError.js";

const toggleSubscription = asyncHandler(async (res , req) => {
    const {channelId} = req.params

    if(!mongoose.isObjectIdOrHexString(id)){
        throw new ApiError(400 , "Invalid Id format")
    }

    const filter = {
        subscriber : req.user._id,
        channel : channelId
    }

    const existingSubscription = await Subscription.findOne(filter)

    if(existingSubscription){
        const unSubscribed = await Subscription.findByIdAndDelete(existingSubscription._id)
        if(!unSubscribed){
            throw new ApiError(400  , "Failed to unsubscribe channel")
        }
        res
            .status(200)
            .json(
                new ApiResponse(200 , {isSubscribed : false , unSubscribed} , "Unsubscribed successfully")
            )
    }else{
        const subscribed = await Subscription.create(filter)
        if(!subscribed){
            throw new ApiError(400 , "Failed to subscribe channel")
        }
        res
            .status(200)
            .json(
                new ApiResponse(200 , {isSubscribed : true , subscribed} , "Subscribed Successfully")
            )

    }

})

export {
    toggleSubscription
}
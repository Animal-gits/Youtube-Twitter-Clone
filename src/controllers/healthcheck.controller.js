import mongoose from "mongoose";
import { asyncHandler } from "../helpers/asyncHandler";
import { ApiResponse } from "../helpers/ApiResponse";

const getHealth  = asyncHandler(async (req , res) => {
    const dbState = mongoose.connection.readyState

    const isConnectedDB = dbState === 1;

    const healthStatus = {
        status : isConnectedDB ? "ok" : "degraded" ,
        database : isConnectedDB ? "connected" : "disconnected",
        timestamp : new Date().toISOString(),
        uptime: process.uptime()
    }

    res
        .status(isConnectedDB ? 200 : 503)
        .json(
            new ApiResponse(
                isConnectedDB ? 200 : 503,
                healthStatus,
                isConnectedDB ? "Server is Healthy" : "Server is ready"
            )
        )
})


export {
    getHealth
}
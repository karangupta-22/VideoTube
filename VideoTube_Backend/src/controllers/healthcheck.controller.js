import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async(req,res) => {
    // Todo : build a healthcheck response that simply return the ok status as json with a message


    // Check if the service is running
    const healthData = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        message: "Service is healthy",
        status: "OK"
    };


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            healthData,
            "Health check passed successfully"
        )
    );

});

export {healthcheck}
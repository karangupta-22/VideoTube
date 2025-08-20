import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req, _, next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Athorization")?.replace("Bearer", "")
 
     if(!token){
         throw new ApiError(401, "Unuthorized request")
     }
 
     const decodetoken = Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     await User.findById(decodetoken?._id).select("-password -refreshToken")
 
     if(!user) {
         throw new ApiError(401, "Invalid Access token")
     }
 
     req.user = user;
     next()
   } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
   }
})
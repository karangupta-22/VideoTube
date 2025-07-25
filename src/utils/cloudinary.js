import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // console.log("file is upload on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary files
        return null;
    }
}

export {uploadOnCloudinary}
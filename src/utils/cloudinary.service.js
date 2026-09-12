import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name : "dvkkqf4xn",
    api_key : "584477214286873",
    api_secret : "VSOcPSwPpfWiIkPV2JJxgViJzIY"
})

const uploadOnCloudinary = async (localeFilePath) => {
    try {
        if (!localeFilePath) {
            return null 
        }
        //upload th file on cloudiary
        const response = await cloudinary.uploader.upload(localeFilePath , {
            resource_type : "auto"
        })
        // file has been uploaded
        console.log("file has been uploaded on cloudinary" , response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localeFilePath) //remove the locally saved temporary file as the uplaod operation got failed
        return null
    }
}

export {uploadOnCloudinary}
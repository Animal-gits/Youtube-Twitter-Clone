import express from 'express'
import {
    loginUser, 
    registerUser , 
    logoutUser , 
    refreshAccessToken, 
    changeUserPassword,
    updateAccountDetails,
    getCurretnUser,
    updateAvatarImage,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { protect } from '../middlewares/auth.middleware.js';
const router = express.Router()

//auth Routes
router.post('/register' , upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]) , registerUser)


router.post('/login' , loginUser)
router.post("/refresh_token" , refreshAccessToken)

//secured / protected routes
router.post('/logout' ,protect, logoutUser)
router.post("/change_password" , protect , changeUserPassword)
router.get("/get_current_user" , protect , getCurretnUser)
router.patch("/update_details" , protect , updateAccountDetails)
router.patch("/update_avatar" , protect  , upload.single("avatar"), updateAvatarImage)
router.patch("/update_cover" , protect , upload.single('coverImage') , updateCoverImage)
router.get("/c/:username" , protect , getUserChannelProfile)
router.get("/watch_history", protect , getWatchHistory)



//just checking 


export default router
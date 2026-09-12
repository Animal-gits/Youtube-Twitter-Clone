import express from 'express'
import {loginUser, registerUser , logoutUser , refreshAccessToken} from '../controllers/user.controller.js'
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


export default router
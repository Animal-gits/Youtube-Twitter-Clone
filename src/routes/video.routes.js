import {Router} from 'express'
import { protect } from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js'

import { getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoDesc, updateVideoFile, updateVideoThumbnail, updateVideoTitle } from '../controllers/video.controller.js';

const router = Router()

router.post("/publish"  , protect , 
    upload.fields([
        {
            name : "videoFile",
            maxCount : 1
        },
        {
            name : "thumbnail",
            maxCount : 1
        }
    ]),
    publishVideo
)

router.get("/get_all" , protect , getAllVideos)
router.get("/get_by_id/:videoId", protect , getVideoById)
router.patch("/update_video_file/:videoId" , protect ,upload.single("video") , updateVideoFile)
router.patch("/update_title/:videoId" , protect , updateVideoTitle)
router.patch("/update_desc/:videoId", protect ,updateVideoDesc)
router.patch("/update_thumbnail/:videoId" , protect ,upload.single("thumbnail") ,  updateVideoThumbnail)
router.patch('/publish_status/:videoId' , protect , togglePublishStatus)

export default router
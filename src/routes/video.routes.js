import {Router} from 'express'
import { protect } from '../middlewares/auth.middleware';
import { getAllVideos, getVideoById, publishVideo, updateVideoDesc, updateVideoFile, updateVideoThumbnail, updateVideoTitle } from '../controllers/video.controller';

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
router.patch("/update_video_file/:videoId" , protect , updateVideoFile)
router.patch("/update_title/:videoId" , protect , updateVideoTitle)
router.patch("/update_desc/:videoId", protect ,updateVideoDesc)
router.patch("/update_thumbnail/:videoId" , protect , updateVideoThumbnail)
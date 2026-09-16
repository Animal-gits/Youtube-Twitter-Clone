import {Router} from 'express'
import { protect } from '../middlewares/auth.middleware';
import { getAllVideos, getVideoById, publishVideo, updateVideoFile, updateVideoTitle } from '../controllers/video.controller';

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
router.get("/get_by_id" , protect , getVideoById)
router.patch("/update_video_file" , protect , updateVideoFile)
router.patch("/update_title" , protect , updateVideoTitle)

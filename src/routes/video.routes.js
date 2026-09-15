import {Router} from 'express'
import { protect } from '../middlewares/auth.middleware';
import { getAllVideos, publishVideo } from '../controllers/video.controller';

const router = Router()

router.post("/video/publish"  , protect , 
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

router.get("/video/get_all" , protect , getAllVideos)
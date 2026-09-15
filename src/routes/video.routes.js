import {Router} from 'express'
import { protect } from '../middlewares/auth.middleware';

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
    ])
)
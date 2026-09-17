import {Router} from "express"
import { createPlaylist } from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create" , protect , createPlaylist)

export default router
import {Router} from "express"
import { createPlaylist, getUserPlaylists } from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create" , protect , createPlaylist)
router.get("/get_user_playlists" , protect , getUserPlaylists)

export default router
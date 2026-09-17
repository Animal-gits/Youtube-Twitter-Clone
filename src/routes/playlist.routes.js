import {Router} from "express"
import { createPlaylist, getPlaylistById, getUserPlaylists  , addVideoToPlaylist} from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create" , protect , createPlaylist)
router.get("/get_user_playlists/:userId" , protect , getUserPlaylists)
router.get("/get_playlist" , protect , getPlaylistById)
router.patch("/add_video/:playlist/:videoId" , protect , addVideoToPlaylist)

export default router
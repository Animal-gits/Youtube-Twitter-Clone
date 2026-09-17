import {Router} from "express"
import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create" , protect , createPlaylist)
router.get("/get_user_playlists/:userId" , protect , getUserPlaylists)
router.get("/get_playlist" , protect , getPlaylistById)

export default router
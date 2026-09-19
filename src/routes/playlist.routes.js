import {Router} from "express"
import { createPlaylist, getPlaylistById, getUserPlaylists  , addVideoToPlaylist, updatePlaylist, deletePlaylist} from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create" , protect , createPlaylist)
router.get("/get_user_playlists" , protect , getUserPlaylists)
router.get("/get_playlist" , protect , getPlaylistById)
router.patch("/add_video/:playlistId/:videoId" , protect , addVideoToPlaylist)
router.delete("/remove_video/:playlistId/:videoId" , protect , removeVideoToPlaylist)
router.delete("/delete_playlist/:playlistId" , protect , deletePlaylist)
router.patch("/update_playlist/:playlistId"  , protect  , updatePlaylist)

export default router
import express from "express"
import { protect } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";


const router = express.Router()

//protected routes

router.post("/c/:videoId" , protect , addComment)
router.get("/c/videoId" , protect , getComments)
router.patch("/c/:commentId" , protect , updateComment)
router.delete("/c/:commentId" , protect , deleteComment)

export default router
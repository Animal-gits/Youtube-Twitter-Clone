import express from "express"
import { protect } from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";


const router = express.Router()

router.post("/c/:videoId" , protect , addComment)

export default router
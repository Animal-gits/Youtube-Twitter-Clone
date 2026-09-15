import {Router} from "express"
import {protect} from "../middlewares/auth.middleware.js"
import { toggleLike } from "../controllers/like.controller.js";

const router = Router()

router.post("/toggle/:type:/id" , protect , toggleLike)

export {router}
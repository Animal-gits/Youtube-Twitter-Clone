import {Router} from "express"
import { createTweet } from "../controllers/tweet.controller";

const router = Router()

router.post("/add_tweet" , createTweet)

export {router}
import {Router} from "express"
import { createTweet, getMyTweets } from "../controllers/tweet.controller";

const router = Router()

router.post("/add_tweet" , protect ,createTweet)
router.get("/user/:userId" , protect , getUserTweets )
router.get("/user/my_tweets" , protect , getMyTweets )

export {router}
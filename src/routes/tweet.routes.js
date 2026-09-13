import {Router} from "express"
import { createTweet, deleteTweet, getMyTweets , getUserTweets, updateTweet } from "../controllers/tweet.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router()

router.post("/add_tweet" , protect ,createTweet)
router.get("/tweet/:userId" , protect , getUserTweets )
router.get("/my_tweets" , protect , getMyTweets )
router.patch("/update_tweet" , protect , updateTweet )
router.delete("/delete_tweet"  , protect , deleteTweet)

export {router}
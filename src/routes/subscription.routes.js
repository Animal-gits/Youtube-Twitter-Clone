import {Router} from "express"
import { protect } from "../middlewares/auth.middleware";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller";

const router  = Router()

router.post("/toggle" , protect , toggleSubscription)
router.get('/subscribers' , protect , getUserChannelSubscribers)
router.get("/channels" , protect , getSubscribedChannels)

export default router
import {Router} from "express"
import { protect } from "../middlewares/auth.middleware";
import { getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller";

const router  = Router()

router.post("/toggle" , protect , toggleSubscription)
router.get('/subscribers' , protect , getUserChannelSubscribers)

export default router
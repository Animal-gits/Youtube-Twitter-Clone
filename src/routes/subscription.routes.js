import {Router} from "express"
import { protect } from "../middlewares/auth.middleware";
import { toggleSubscription } from "../controllers/subscription.controller";

const router  = Router()

router.post("/toggle" , protect , toggleSubscription)


export default router
import {Router} from "express"
import { getHealth } from "../controllers/healthcheck.controller";

const router = Router()

router.post("/" , getHealth)

export default router
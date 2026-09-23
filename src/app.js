import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middlewares/errorHandler.middleware.js';
import env from "./config/env.js"
import cors from "cors"

const app = express()

app.use(cors({
    origin : env.CORS_ORIGIN,
    credentials : true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : true , limit :'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

// routes imports 
import HealthRouter from "../src/routes/healthcheck.routes.js"
import UserRouter from '../src/routes/user.routes.js'
import CommentRouter from '../src/routes/comment.routes.js'
import TweetRouter from '../src/routes/tweet.routes.js'
import LikeRouter from "../src/routes/like.routes.js"
import VideoRouter from "../src/routes/video.routes.js"
import PlaylistRouter from "../src/routes/playlist.routes.js"
import SubscriptionRouter from "../src/routes/subscription.routes.js"
import DashboardRouter from "../src/routes/dashboard.routes.js"
import env from './config/env.js';
//routes declaration
app.use("/api/v1/health" , HealthRouter)
app.use('/api/v1/users' , UserRouter)
app.use("/api/v1/comments" , CommentRouter)
app.use("/api/v1/tweets" , TweetRouter)
app.use("/api/v1/likes" , LikeRouter)
app.use("/api/v1/videos" , VideoRouter)
app.use("/api/v1/playlist" , PlaylistRouter)
app.use("/api/v1/subscription" , SubscriptionRouter)
app.use("/api/v1/dashboard"  , DashboardRouter)

app.use(notFound)
app.use(errorHandler)

export  {app}
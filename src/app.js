import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : true , limit :'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

// routes imports 
import userRouter from '../src/routes/user.routes.js'
import commentRouter from '../src/routes/comment.routes.js'
import TweetRouter from '../src/routes/tweet.routes.js'
import LikeRouter from "../src/routes/like.routes.js"
import VideoRouter from "../src/routes/video.routes.js"
import PlaylistRouter from "../src/routes/playlist.routes.js"

//routes declaration
app.use('/api/v1/users' , userRouter)
app.use("/api/v1/comments" , commentRouter)
app.use("/api/v1/tweets" , TweetRouter)
app.use("/api/v1/likes" , LikeRouter)
app.use("/api/v1/videos" , VideoRouter)
app.use("/api/v1/playlist" , PlaylistRouter)


export  {app}
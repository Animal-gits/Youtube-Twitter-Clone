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

//routes declaration
app.use('/api/v1/users' , userRouter)


export  {app}
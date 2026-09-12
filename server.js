import {app} from './src/app.js'
import dotenv from 'dotenv'
import {connectDB} from './src/config/db.js'
// import dns from "node:dns";


dotenv.config({
    path : './.env'
})

connectDB()
// dns.setServers(["8.8.8.8", "1.1.1.1"]);
// dotenv.config()

console.log(process.env.PORT)
app.listen(process.env.PORT , () => {
    console.log("Server is running on port 3000")
})
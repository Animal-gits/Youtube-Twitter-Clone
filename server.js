import {app} from './src/app.js'
import {connectDB} from './src/config/db.js'
import env from "./src/config/env.js"
// import dns from "node:dns";


dotenv.config({
    path : './.env'
})

connectDB()
// dns.setServers(["8.8.8.8", "1.1.1.1"]);
// dotenv.config()

console.log(env.PORT)
app.listen(env.PORT , () => {
    console.log("Server is running on port 3000")
})
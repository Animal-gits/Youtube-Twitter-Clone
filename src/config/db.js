import mongoose from 'mongoose'

const connectDB = async() => {
    try {
        console.log("MONGO_URI:" , process.env.MONGO_URI)
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI , {
            dbName : "yt-clone"
        })

        console.log("MONGODB connection Host !! :" , connectionInstance.connection.host)

    } catch (error) {
        console.log("MongoDb connection failed" , error.message)
        process.exit(1)
    }
}

export {connectDB}
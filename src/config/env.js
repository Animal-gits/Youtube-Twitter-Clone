import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
})


if(!process.env.MONGO_URI){
    console.error(
        "Warning : MONGO_URI is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.JWT_SECRET){
    console.error(
        "Warning : JWT_SECRET is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.PORT){
    console.error(
        "Warning : PORT is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.ACCESS_TOKEN_SECRET){
    console.error(
        "Warning : ACCESS_TOKEN_SECRET is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.ACCESS_TOKEN_EXPIRY){
    console.error(
        "Warning : ACCESS_TOKEN_EXPIRY is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.REFRESH_TOKEN_SECRET){
    console.error(
        "Warning : REFRESH_TOKEN_SECRET is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.REFRESH_TOKEN_EXPIRY){
    console.error(
        "Warning : REFRESH_TOKEN_EXPIRY is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.NODE_ENV){
    console.error(
        "Warning : NODE_ENV is not set. Please set it in the .env file."
    )
    process.exit(1)
}


const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    PORT : process.env.PORT,
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET ,
    ACCESS_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY,
    NODE_ENV : process.env.NODE_ENV
}


export default Object.freeze(config)
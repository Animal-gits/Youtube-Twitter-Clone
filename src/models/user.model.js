import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String , // cloudinary url
        required : true
    },
    coverImage : {
        type : String // cloudinary url
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "videos"
        }
    ],
    password :{
        type : String ,
        required : [ true, "Password is required"]
    },
    refreshToken : {
        type: String
    }
} , {
    timestamps : true
})

userSchema.pre('save' ,  async function (next){
    const user = this 
    if(!user.isModified("password")) return next()
    
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt(user.password , salt)
    next()
})

userSchema.methods.matchPassword = async function(password){
    const user = this
    return await bcrypt.compare(password , user.password)
}

userSchema.methods.generateAccessToken = function(){
    const user = this
    return jwt.sign({
        _id : user._id,
        email : user.email,
        username : user.userame,
        fullName : user.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }

    )
}

userSchema.methods.generateRefreshToken = function (){
    const user = this
    return jwt.sign(
        {
            _id : user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User' , userSchema)

export {User}
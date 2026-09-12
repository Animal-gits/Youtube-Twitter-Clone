const asyncHandler = (fa) => async(req , res , next) => {
    try {
        await fn(req , res , next)
    } catch (error) {
        res.status(error.status || 500).json({
            success : false,
            error : error.message
        })
    }
}

export {asyncHandler}
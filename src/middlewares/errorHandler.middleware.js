import env from "../config/env.js"

const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route Not Found: ${req.method} ${req.originalUrl}`,
    });
};


const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;

        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // Mongoose invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for '${err.path}'`;
    }

    // Log actual error internally
    console.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
    });

    // Don't expose internal errors in production
    if (statusCode >= 500 && env.NODE_ENV === "production") {
        message = "Internal Server Error";
    }

    // Let Express handle errors if response already started
    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV !== "production" && {
            stack: err.stack,
        }),
    });
};

export {
    notFound,
    errorHandler
}
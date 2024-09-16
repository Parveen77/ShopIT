import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    
    //Handle Validation error
    if(err.name ==="ValidationError"){
        const message = Object.values(err.errors).map((values) => values.message);
        error = new ErrorHandler(message, 400);
    }

    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(error.statusCode).json({
            message: error.message,
            error: err, 
            stack: err?.stack,
        });
    }
    
    if(process.env.NODE_ENV === "PRODUCTION"){
        res.status(error.statusCode).json({
            message: error.message,
        });
    }
};
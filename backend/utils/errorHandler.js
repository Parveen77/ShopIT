class ErrorHandler extends Error {
    constructor (message, statusCode){
        super(message);
        this.statusCode = statusCode;

        //Create stacj property to show where the error actually occurred
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler
export const createHttpError = (statusCode, message, details = null) => {
    const error = new Error(message);
    error.statusCode = statusCode;

    if (details) {
        error.details = details;
    }

    return error;
};

export const sendErrorResponse = (res, error, fallbackMessage) => {
    const statusCode = error.statusCode ?? 500;
    const responseBody = {
        success: false,
        message: statusCode >= 500 ? fallbackMessage : error.message,
    };

    if (error.details) {
        responseBody.details = error.details;
    }

    return res.status(statusCode).json(responseBody);
};

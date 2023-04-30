class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'ApiError';
        this.message = message;
        this.statusCode = statusCode;
    }
}
module.exports = ApiError;

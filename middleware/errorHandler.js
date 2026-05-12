exports.globalErrorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`); // Log internal (bisa ke Sentry/Datadog)

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Terjadi kesalahan internal pada server.';

    res.status(statusCode).json({
        success: false,
        error: message
    });
};

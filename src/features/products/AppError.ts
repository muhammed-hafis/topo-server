
interface AppError extends Error {
    statusCode: number;
}

export const createError = (message: string, statusCode: number): AppError => {
    const err = new Error(message) as AppError;
    err.statusCode = statusCode;
    return err;
};
import { ErrorRequestHandler } from "express";

export class ApiError extends Error {
    constructor(readonly status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ApiError) {
        res.status(error.status).json({ error: error.message });
        return;
    }
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Something went wrong on our end.' });
};
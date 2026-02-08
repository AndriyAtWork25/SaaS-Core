// AppError.ts
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statuscode = 500, isOperational = true) {
        super(message);
        this.statusCode = statuscode;
        this.isOperational = isOperational;
    }
}

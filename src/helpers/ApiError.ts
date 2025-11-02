class ApiError extends Error {
    code?: number;
    waitUntil?: string;

    constructor(message: string, code?: number, waitUntil?: string) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.waitUntil = waitUntil;
    }
}

export default ApiError;

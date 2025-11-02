import ApiError from "../helpers/ApiError.ts";

export async function handleApiResponse<T>(
    responsePromise: Promise<Response>
): Promise<T> {
    try {
        const response = await responsePromise;

        if (!response.ok) {
            const error = await response.json();

            const message = typeof error === 'string' ? error : error.message || 'API Error';
            const code = error?.code;
            const waitUntil = error?.waitUntil;

            return Promise.reject(new ApiError(message, code, waitUntil));
        }

        return response.json();
    } catch (err) {
        if (err instanceof Response) {
            const error = await err.json();
            const message = typeof error === 'string' ? error : error.message || 'API Error';
            const code = error?.code;
            const waitUntil = error?.waitUntil;

            return Promise.reject(new ApiError(message, code, waitUntil));
        }
        return Promise.reject(err);
    }
}

export async function handleApiResponse<T>(
    responsePromise: Promise<Response>
): Promise<T> {
    try {
        const response = await responsePromise;

        if (!response.ok) {
            const error = await response.json();
            return Promise.reject(new Error(error.message || 'API Error'));
        }

        return response.json();
    } catch (err) {
        if (err instanceof Response) {
            const error = await err.json();
            return Promise.reject(new Error(error.message || 'API Error'));
        }
        return Promise.reject(err);
    }
}
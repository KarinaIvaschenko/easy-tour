export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const waitUntil = async (isoTime: string) => {
    const delay = Math.max(0, new Date(isoTime).getTime() - Date.now());
    await sleep(delay);
};

export const MAX_RETRIES = 2;
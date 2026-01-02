const API_BASE = import.meta.env.VITE_API_BASE;

export type AuthResponse = {
    accessToken: string;
    user: {id: string; email: string; name?: string};
};

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown, accessToken?: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            ...(body ? {'Content-Type': 'application/json'} : {}),
            ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            const json = await res.json();
            throw new Error(json.error || JSON.stringify(json));
        } else {
            throw new Error(`Request failed (${res.status})`);
        }
    }

    return (await res.json()) as T;
}

export function apiPost<T>(path: string, body: unknown, accessToken?: string) {
    return request<T>('POST', path, body, accessToken);
}

export function apiGet<T>(path: string, accessToken?: string) {
    return request<T>('GET', path, undefined, accessToken);
}

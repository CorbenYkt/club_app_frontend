const RAW = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

const DEFAULT_PROD_API = 'https://api.pulseclub.co.nz';
const DEFAULT_DEV_API = 'http://localhost:4000';

export const API_BASE = RAW && RAW.length > 0 ? RAW : import.meta.env.PROD ? DEFAULT_PROD_API : DEFAULT_DEV_API;

if (import.meta.env.PROD && (!RAW || RAW.length === 0)) {
    console.warn(`VITE_API_BASE_URL is missing in PROD build; using default ${DEFAULT_PROD_API}`);
}

export type AuthResponse = {
    accessToken: string;
    user: {id: string; email: string; name?: string};
};

let _getAccessToken: () => string | null = () => null;
let _setAccessToken: (t: string | null) => void = () => {};
let _onAuthFail: () => void = () => {};

export function bindAuth(opts: {
    getAccessToken: () => string | null;
    setAccessToken: (t: string | null) => void;
    onAuthFail: () => void;
}) {
    _getAccessToken = opts.getAccessToken;
    _setAccessToken = opts.setAccessToken;
    _onAuthFail = opts.onAuthFail;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const res = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: '{}',
            });
            if (!res.ok) return null;
            const json = (await res.json()) as {accessToken?: string};
            return json.accessToken ?? null;
        })().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

async function request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
    accessToken?: string,
    retry = true,
): Promise<T> {
    const token = accessToken ?? _getAccessToken();

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            ...(body ? {'Content-Type': 'application/json'} : {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
            _setAccessToken(null);
            _onAuthFail();
        } else {
            _setAccessToken(newToken);
            return request<T>(method, path, body, newToken, false);
        }
    }

    if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            const json = await res.json();
            throw new ApiError(res.status, json.message || `Request failed (${res.status})`, json.error);
        }
        throw new ApiError(res.status, `Request failed (${res.status})`);
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
}

export function apiPost<T>(path: string, body: unknown = {}, accessToken?: string) {
    return request<T>('POST', path, body, accessToken);
}

export function apiGet<T>(path: string, accessToken?: string) {
    return request<T>('GET', path, undefined, accessToken);
}

export class ApiError extends Error {
    status: number;
    code?: string;
    constructor(status: number, message: string, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

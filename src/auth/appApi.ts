const RAW = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

const DEFAULT_PROD_API = import.meta.env.VITE_API_BASE_URL;
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

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiErrorBody = {
    error: {
        code: string;
        message: string;
        details?: unknown;
        requestId?: string;
    };
};

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
}

function isApiErrorBody(x: unknown): x is ApiErrorBody {
    if (!isRecord(x)) return false;
    const e = x.error;
    if (!isRecord(e)) return false;
    return typeof e.code === 'string' && typeof e.message === 'string';
}

async function readJsonSafe(res: Response): Promise<unknown> {
    const text = await res.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export class ApiError extends Error {
    readonly status: number;
    readonly code?: string;
    readonly details?: unknown;
    readonly requestId?: string;
    readonly raw?: unknown;

    constructor(args: {
        status: number;
        message: string;
        code?: string;
        details?: unknown;
        requestId?: string;
        raw?: unknown;
    }) {
        super(args.message);
        this.name = 'ApiError';
        this.status = args.status;
        this.code = args.code;
        this.details = args.details;
        this.requestId = args.requestId;
        this.raw = args.raw;
    }
}

async function request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    accessToken?: string,
    retry = true,
): Promise<T> {
    const token = accessToken ?? _getAccessToken();

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            ...(body !== undefined ? {'Content-Type': 'application/json'} : {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        credentials: 'include',
        body: body !== undefined ? JSON.stringify(body) : undefined,
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
        const payload = ct.includes('application/json') ? await readJsonSafe(res) : await res.text().catch(() => null);

        if (isApiErrorBody(payload)) {
            throw new ApiError({
                status: res.status,
                message: payload.error.message,
                code: payload.error.code,
                details: payload.error.details,
                requestId: payload.error.requestId,
                raw: payload,
            });
        }

        throw new ApiError({
            status: res.status,
            message: res.statusText ? `${res.status} ${res.statusText}` : `Request failed (${res.status})`,
            raw: payload,
        });
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return (await res.json()) as T;

    const text = await res.text();
    return text as unknown as T;
}

export function apiPost<T>(path: string, body?: unknown, accessToken?: string) {
    return request<T>('POST', path, body, accessToken);
}

export function apiGet<T>(path: string, accessToken?: string) {
    return request<T>('GET', path, undefined, accessToken);
}

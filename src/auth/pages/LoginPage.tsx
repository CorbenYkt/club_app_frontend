import {GoogleLogin} from '@react-oauth/google';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {apiPost, type AuthResponse} from '../api';
import {useAuth} from '../useAuth';

export function Spinner() {
    return (
        <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
        />
    );
}

export default function LoginPage() {
    const nav = useNavigate();
    const {setSession, user, bootstrapped} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const doLogin = async (fn: () => Promise<AuthResponse>, fallbackError: string) => {
        if (loading) return;
        setErr(null);
        setLoading(true);

        try {
            const session = await fn();
            setSession(session);
            nav('/', {replace: true});
        } catch (e) {
            setErr(e instanceof Error ? e.message : fallbackError);
            setLoading(false);
        }
    };

    const onEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await doLogin(() => apiPost<AuthResponse>('/auth/login', {email, password}), 'Login failed');
    };

    if (bootstrapped && user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-2xl shadow p-6 bg-white">
                    <h1 className="text-2xl font-semibold">You’re already signed in</h1>
                    <p className="mt-2 text-gray-600">
                        You’re signed in as <span className="font-medium">{user.email}</span>
                    </p>

                    <Link
                        to="/logout"
                        className="mt-4 inline-flex w-full justify-center rounded-xl bg-indigo-600 text-white p-3">
                        Logout
                    </Link>

                    <button
                        onClick={() => nav('/', {replace: true})}
                        className="mt-3 w-full rounded-xl border p-3 hover:bg-gray-50 cursor-pointer">
                        Go to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-2xl shadow p-6 bg-white">
                {loading && (
                    <div className="absolute inset-0 z-10 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                            <span className="text-sm text-gray-700">Signing in…</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-semibold">Sign in</h1>

                <div className="mt-4">
                    <div className={loading ? 'pointer-events-none opacity-60' : ''}>
                        <GoogleLogin
                            onSuccess={(cred) =>
                                doLogin(
                                    () =>
                                        apiPost<AuthResponse>('/auth/google', {
                                            credential: cred.credential,
                                        }),
                                    'Google login failed',
                                )
                            }
                            onError={() => setErr('Google login failed')}
                        />
                    </div>
                </div>

                <div className="my-4 text-center text-sm text-gray-500">or</div>

                <form onSubmit={onEmailLogin} className="space-y-3">
                    <input
                        className="w-full rounded-xl border p-3 disabled:opacity-60"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        disabled={loading}
                    />
                    <input
                        className="w-full rounded-xl border p-3 disabled:opacity-60"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                        disabled={loading}
                    />

                    {err && <div className="text-sm text-red-600">{err}</div>}

                    <button
                        className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                        disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner /> Signing in…
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
                <div className="mt-4 grid gap-2">
                    <Link
                        to="/register"
                        className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 ${
                            loading ? 'pointer-events-none opacity-60' : ''
                        }`}>
                        Create account
                    </Link>
                    <Link
                        to="/forgot-password"
                        className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 ${
                            loading ? 'pointer-events-none opacity-60' : ''
                        }`}>
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    );
}

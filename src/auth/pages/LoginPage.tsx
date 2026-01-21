import {GoogleLogin} from '@react-oauth/google';
import {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
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

    const location = useLocation();
    const fromSomewhere = location.state?.from as string | undefined;

    const doLogin = async (fn: () => Promise<AuthResponse>, fallbackError: string) => {
        if (loading) return;
        setErr(null);
        setLoading(true);

        try {
            const session = await fn();
            setSession(session);
            nav(fromSomewhere ?? '/dashboard', {replace: true});
        } catch (e) {
            setErr(e instanceof Error ? e.message : fallbackError);
            setLoading(false);
        }
    };

    const onEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await doLogin(() => apiPost<AuthResponse>('/auth/login', {email, password}), 'Login failed');
    };

    // Already signed in
    if (bootstrapped && user) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-50 antialiased flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/60 shadow-2xl p-8">
                    <div className="mb-6">
                        <div className="text-2xl font-extrabold tracking-tighter italic">
                            PULSE<span className="text-green-500">.</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight">You’re already signed in</h1>
                    <p className="mt-2 text-slate-400">
                        You’re signed in as <span className="text-slate-50 font-semibold">{user.email}</span>
                    </p>

                    <div className="mt-8 space-y-3">
                        <Link
                            to="/logout"
                            className="w-full inline-flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 px-4 py-3 font-extrabold uppercase tracking-tight transition-all transform hover:scale-[1.02] neon-glow">
                            Logout
                        </Link>

                        <button
                            onClick={() => nav('/', {replace: true})}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-50 hover:bg-slate-800/60 transition cursor-pointer">
                            Go to home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 antialiased flex items-center justify-center px-6 py-12">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/60 shadow-2xl overflow-hidden">
                {/* Green accent */}
                <div className="h-1 w-full bg-green-500" />

                <div className="p-8">
                    {/* Top brand */}
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/" className="text-2xl font-extrabold tracking-tighter italic">
                            PULSE<span className="text-green-500">.</span>
                        </Link>
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Member Login</span>
                    </div>
                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-sm">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-slate-50" />
                                <span className="text-sm text-slate-200">Signing in…</span>
                            </div>
                        </div>
                    )}
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Sign in</h1>
                    <p className="mt-2 text-slate-400">Access your member pass and start saving.</p>
                    {/* Google login */}
                    <div className="mt-6 items-center">
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
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-800" />
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">or</div>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>
                    {/* Email/password */}
                    <form onSubmit={onEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                Email
                            </label>
                            <input
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                Password
                            </label>
                            <input
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {err && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {err}
                            </div>
                        )}

                        <button
                            className="w-full rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 px-4 py-3 text-center font-extrabold uppercase tracking-tight transition-all transform hover:scale-[1.02] neon-glow cursor-pointer disabled:opacity-60"
                            disabled={loading}>
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Spinner /> Signing in…
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                    {/* Links */}
                    <div className="mt-6 grid gap-3">
                        <Link
                            to="/register"
                            className={`w-full rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-center text-slate-50 hover:bg-slate-800/50 transition ${
                                loading ? 'pointer-events-none opacity-60' : ''
                            }`}>
                            Create account
                        </Link>
                        <Link
                            to="/forgot-password"
                            className={`w-full rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-center text-slate-50 hover:bg-slate-800/50 transition ${
                                loading ? 'pointer-events-none opacity-60' : ''
                            }`}>
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

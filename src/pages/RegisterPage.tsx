import {useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {apiPost, type AuthResponse} from '../auth/api';
import {useAuth} from '../auth/useAuth';

function Spinner() {
    return <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

export default function RegisterPage() {
    const nav = useNavigate();
    const {setSession} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const passwordError = useMemo(() => {
        if (!password) return null;
        if (password.length < 8) return 'Password must be at least 8 characters';
        return null;
    }, [password]);

    const confirmError = useMemo(() => {
        if (!confirm) return null;
        if (password !== confirm) return 'Passwords do not match';
        return null;
    }, [password, confirm]);

    const canSubmit = !loading && !!email && !!password && !!confirm && !passwordError && !confirmError;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setErr(null);
        setLoading(true);

        try {
            const session = await apiPost<AuthResponse>('/auth/register', {email, password});
            setSession(session);
            nav('/', {replace: true});
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900 antialiased">
            <div className="relative w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-10 rounded-3xl bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                            <Spinner />
                            <span className="text-sm text-slate-200">Creating account…</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-black tracking-tight mb-1">Create your account</h1>
                <p className="text-sm text-slate-400 mb-6">Join Pulse and start saving at local venues</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        disabled={loading}
                        required
                    />

                    <div className="space-y-1">
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                            placeholder="Password (min 8 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            autoComplete="new-password"
                            disabled={loading}
                            required
                        />
                        {passwordError && <div className="text-xs text-red-400">{passwordError}</div>}
                    </div>

                    <div className="space-y-1">
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            type="password"
                            autoComplete="new-password"
                            disabled={loading}
                            required
                        />
                        {confirmError && <div className="text-xs text-red-400">{confirmError}</div>}
                    </div>

                    {err && <div className="text-sm text-red-400">{err}</div>}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full rounded-2xl bg-green-500 px-4 py-3 font-extrabold text-slate-950 transition hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <Spinner /> Creating…
                            </>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </form>

                <div className="mt-6 grid gap-3">
                    <Link
                        to="/login"
                        className="w-full rounded-xl border border-slate-700 p-3 text-center text-slate-200 hover:bg-slate-800 transition">
                        Already have an account? Sign in
                    </Link>
                </div>

                <div className="mt-6 text-xs text-slate-500 text-center">
                    Need help?{' '}
                    <a className="underline hover:text-green-400" href="mailto:pulseclubnz@gmail.com">
                        pulseclubnz@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}

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
        if (password.length < 8) return 'Password must be at least 8 characters.';
        return null;
    }, [password]);

    const confirmError = useMemo(() => {
        if (!confirm) return null;
        if (password !== confirm) return 'Passwords do not match.';
        return null;
    }, [password, confirm]);

    const canSubmit = !loading && !!email && !!password && !!confirm && !passwordError && !confirmError;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setErr(null);

        if (passwordError) {
            setErr(passwordError);
            return;
        }
        if (confirmError) {
            setErr(confirmError);
            return;
        }

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-2xl shadow p-6 bg-white">
                {loading && (
                    <div className="absolute inset-0 z-10 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                            <span className="text-sm text-gray-700">Creating account…</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-semibold">Create account</h1>

                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                    <input
                        className="w-full rounded-xl border p-3 disabled:opacity-60"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        autoComplete="email"
                        disabled={loading}
                    />

                    <div className="space-y-1">
                        <input
                            className="w-full rounded-xl border p-3 disabled:opacity-60"
                            placeholder="Password (min 8 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            autoComplete="new-password"
                            disabled={loading}
                        />
                        {passwordError && <div className="text-xs text-gray-500">{passwordError}</div>}
                    </div>

                    <div className="space-y-1">
                        <input
                            className="w-full rounded-xl border p-3 disabled:opacity-60"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            type="password"
                            required
                            autoComplete="new-password"
                            disabled={loading}
                        />
                        {confirmError && <div className="text-xs text-gray-500">{confirmError}</div>}
                    </div>

                    {err && <div className="text-sm text-red-600">{err}</div>}
                    <button
                        className="w-full rounded-2xl bg-indigo-600 text-white p-3 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                        disabled={!canSubmit}>
                        {loading ? (
                            <>
                                <Spinner /> Creating…
                            </>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </form>
                <div className="mt-3 grid gap-2">
                    <Link
                        to="/login"
                        className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 ${
                            loading ? 'pointer-events-none opacity-60' : ''
                        }`}>
                        Sign in
                    </Link>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                    Need help? Contact{' '}
                    <a className="underline" href="mailto:support@pulseclub.co.nz">
                        support@pulseclub.co.nz
                    </a>
                </div>
            </div>
        </div>
    );
}

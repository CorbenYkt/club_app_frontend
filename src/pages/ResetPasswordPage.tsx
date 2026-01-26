import {useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {apiPost} from '../auth/appApi';
import {Spinner} from '../components/Spinner';

export default function ResetPasswordPage() {
    const [sp] = useSearchParams();
    const token = (sp.get('token') ?? '').trim();

    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setErr(null);

        if (!token) {
            setErr('Missing token');
            return;
        }
        if (p1.length < 8) {
            setErr('Password must be at least 8 characters');
            return;
        }
        if (p1 !== p2) {
            setErr('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await apiPost<{ok: true}>('/auth/password/reset', {token, newPassword: p1});
            setDone(true);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="h-1 w-full bg-green-500" />

                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm">
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-2xl">
                                <Spinner />
                                <span className="text-sm text-slate-200">Updating…</span>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="mb-6">
                            <div className="mono text-xs uppercase tracking-widest text-slate-500">
                                Account security
                            </div>
                            <h1 className="mt-2 text-3xl font-black tracking-tight">
                                Set new <span className="text-green-500">password</span>
                            </h1>
                            <p className="mt-2 text-sm text-slate-400">
                                Choose a strong password (min 8 chars). You’ll be able to sign in right after.
                            </p>
                        </div>

                        {done ? (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-4 text-sm text-slate-200">
                                    Password updated successfully.
                                </div>

                                <div className="grid gap-3">
                                    <Link
                                        to="/login"
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-4 py-3 font-extrabold text-slate-950 transition hover:bg-green-400">
                                        Sign in
                                    </Link>

                                    <Link
                                        to="/"
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                        Back to home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-4">
                                {!token && (
                                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                                        Reset link is missing a token. Please request a new reset email.
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        New password
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
                                        placeholder="New password (min 8 chars)"
                                        value={p1}
                                        onChange={(e) => setP1(e.target.value)}
                                        type="password"
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Repeat new password
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
                                        placeholder="Repeat new password"
                                        value={p2}
                                        onChange={(e) => setP2(e.target.value)}
                                        type="password"
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>

                                {err && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                        {err}
                                    </div>
                                )}

                                <button
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-extrabold text-slate-950 transition hover:bg-green-400 disabled:opacity-60"
                                    disabled={loading || !token}>
                                    {loading ? (
                                        <>
                                            <Spinner /> Updating…
                                        </>
                                    ) : (
                                        'Update password'
                                    )}
                                </button>

                                <div className="grid gap-3 pt-1">
                                    <Link
                                        to="/login"
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                        Back to login
                                    </Link>

                                    <Link
                                        to="/forgot-password"
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                        Send a new reset link
                                    </Link>
                                </div>

                                <div className="pt-2 text-xs text-slate-500">
                                    Need help?{' '}
                                    <a className="underline hover:text-slate-200" href="mailto:support@pulseclub.co.nz">
                                        support@pulseclub.co.nz
                                    </a>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import {useMemo, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {apiPost} from '../api';

export default function ResetPasswordPage() {
    const [sp] = useSearchParams();
    const token = useMemo(() => sp.get('token') ?? '', [sp]);

    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setErr(null);
        setLoading(true);

        if (!token) {
            setLoading(false);
            return setErr('Missing token');
        }
        if (p1.length < 8) {
            setLoading(false);
            return setErr('Password must be at least 8 characters');
        }
        if (p1 !== p2) {
            setLoading(false);
            return setErr('Passwords do not match');
        }

        try {
            await apiPost<{ok: true}>('/auth/password/reset', {token, newPassword: p1});
            setDone(true);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Reset failed');
        } finally {
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
                            <span className="text-sm text-gray-700">Updating…</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-semibold">Set new password</h1>

                {done ? (
                    <div className="mt-4 grid gap-2">
                        Password updated.{' '}
                        <Link to="/login" className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 `}>
                            Sign in
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-3 mt-4">
                        <input
                            className="w-full rounded-xl border p-3 disabled:opacity-60"
                            placeholder="New password"
                            value={p1}
                            onChange={(e) => setP1(e.target.value)}
                            type="password"
                            required
                            disabled={loading}
                        />
                        <input
                            className="w-full rounded-xl border p-3 disabled:opacity-60"
                            placeholder="Repeat new password"
                            value={p2}
                            onChange={(e) => setP2(e.target.value)}
                            type="password"
                            required
                            disabled={loading}
                        />
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        <button
                            className="w-full rounded-xl bg-indigo-600 text-white p-3 cursor-pointer"
                            disabled={loading}>
                            Update password
                        </button>
                        <div className="mt-4 grid gap-2">
                            <Link to="/login" className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 `}>
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

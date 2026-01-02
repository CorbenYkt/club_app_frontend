import {useState} from 'react';
import {Link} from 'react-router-dom';
import {apiPost} from '../api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setErr(null);
        setLoading(true);

        try {
            await apiPost<{ok: true}>('/auth/password/forgot', {email});
            setDone(true);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Failed to send reset email');
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
                            <span className="text-sm text-gray-700">Sending…</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-semibold">Reset password</h1>

                {done ? (
                    <div className="space-y-3 mt-4">
                        If an account exists for <b>{email}</b>, we’ve sent a reset link.
                        <div className="mt-4 grid gap-2">
                            <Link to="/login" className={`w-full rounded-xl border p-3 text-center hover:bg-gray-50 `}>
                                Back to login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-3 mt-4">
                        <input
                            className="w-full rounded-xl border p-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            disabled={loading}
                        />
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        <button
                            className="w-full rounded-xl bg-indigo-600 text-white p-3 cursor-pointer"
                            disabled={loading}>
                            Send reset link
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

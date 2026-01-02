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

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (!token) return setErr('Missing token');
        if (p1.length < 8) return setErr('Password must be at least 8 characters');
        if (p1 !== p2) return setErr('Passwords do not match');

        try {
            await apiPost<{ok: true}>('/auth/password/reset', {token, newPassword: p1});
            setDone(true);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Reset failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl shadow p-6 bg-white">
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
                            className="w-full rounded-xl border p-3"
                            placeholder="New password"
                            value={p1}
                            onChange={(e) => setP1(e.target.value)}
                            type="password"
                            required
                        />
                        <input
                            className="w-full rounded-xl border p-3"
                            placeholder="Repeat new password"
                            value={p2}
                            onChange={(e) => setP2(e.target.value)}
                            type="password"
                            required
                        />
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        <button className="w-full rounded-xl bg-indigo-600 text-white p-3 cursor-pointer">
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

import {useState} from 'react';
import {Link} from 'react-router-dom';
import {apiPost} from '../api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        try {
            await apiPost<{ok: true}>('/auth/password/forgot', {email});
            setDone(true);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Failed to send reset email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl shadow p-6 bg-white">
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
                        />
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        <button className="w-full rounded-xl bg-indigo-600 text-white p-3 cursor-pointer">
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

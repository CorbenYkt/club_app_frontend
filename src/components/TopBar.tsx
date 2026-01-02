import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/useAuth';
import {apiPost} from '../auth/api';

function displayUser(user: {email: string; name?: string}) {
    if (user.name && user.name.trim()) return user.name;
    return user.email;
}

export default function TopBar() {
    const nav = useNavigate();
    const {user, logout, bootstrapped} = useAuth();

    const onLogout = async () => {
        try {
            await apiPost('/auth/logout', {});
        } finally {
            logout();
            nav('/login', {replace: true});
        }
    };

    return (
        <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-3xl font-semibold bg-linear-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent tracking-tight    ">
                    PulseClub
                </Link>

                <div className="flex items-center gap-3 text-sm">
                    {!bootstrapped ? (
                        <div className="text-gray-500">Loading…</div>
                    ) : user ? (
                        <>
                            <div className="text-gray-700">
                                <Link to="/dashboard">
                                    <span className="font-medium">{displayUser(user)}</span>
                                </Link>
                            </div>
                            <button
                                onClick={onLogout}
                                className="rounded-xl border px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div>
                            <Link
                                className="w-full rounded-2xl bg-indigo-600 mx-1 px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                                to="/login">
                                Login
                            </Link>
                            <Link
                                className="w-full rounded-2xl mx-4 px-4 py-3 text-center font-semibold text-indigo-600 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                                to="/register">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

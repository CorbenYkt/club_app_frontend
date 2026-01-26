import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/useAuth';
import {apiPost} from '../auth/appApi';

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
        <nav className="flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
            <Link to="/">
                <span className="inline-flex items-baseline gap-1 text-2xl font-extrabold tracking-tighter italic">
                    <span>PULSE</span>
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse translate-y-1" />
                </span>
            </Link>

            <div>
                {!bootstrapped ? (
                    <div className="text-white">Loading…</div>
                ) : user ? (
                    <>
                        <div className="flex items-center text-white gap-10">
                            <div className="truncate text-sm font-extrabold text-slate-100">
                                <Link to="/dashboard" className="underline">
                                    {displayUser(user)}
                                </Link>
                            </div>
                            <button
                                onClick={onLogout}
                                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link className="text-sm font-semibold hover:text-green-500 transition-colors" to="/login">
                            Member Login
                        </Link>

                        <Link className="text-sm font-semibold hover:text-green-500 transition-colors" to="/register">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

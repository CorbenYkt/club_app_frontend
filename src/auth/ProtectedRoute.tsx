import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './useAuth';
import type {JSX} from 'react';

function FullscreenLoader() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/60 shadow-2xl p-8">
                <div className="text-2xl font-extrabold tracking-tighter italic">
                    PULSE<span className="text-green-500">.</span>
                </div>
                <div className="mt-4 text-sm text-slate-400">Checking session…</div>
                <div className="mt-5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-1/3 bg-green-500/60 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function ProtectedRoute({children}: {children: JSX.Element}) {
    const {user, bootstrapped} = useAuth();
    const location = useLocation();

    if (user) return children;

    if (!bootstrapped) return <FullscreenLoader />;

    return <Navigate to="/login" replace state={{from: location.pathname + location.search}} />;
}

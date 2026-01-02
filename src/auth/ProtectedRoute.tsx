import {Navigate} from 'react-router-dom';
import {useAuth} from './useAuth';
import type {JSX} from 'react';

export function ProtectedRoute({children}: {children: JSX.Element}) {
    const {user, bootstrapped} = useAuth();

    if (!bootstrapped) {
        return <div className="p-6">Loading...</div>;
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
}

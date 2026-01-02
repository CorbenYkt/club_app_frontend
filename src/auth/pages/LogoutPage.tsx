import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {apiPost} from '../api';
import {useAuth} from '../useAuth';

export default function LogoutPage() {
    const nav = useNavigate();
    const {logout} = useAuth();

    useEffect(() => {
        (async () => {
            try {
                await apiPost('/auth/logout', {});
            } finally {
                logout();
                nav('/login', {replace: true});
            }
        })();
    }, [logout, nav]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-sm text-gray-600">Signing out…</div>
        </div>
    );
}

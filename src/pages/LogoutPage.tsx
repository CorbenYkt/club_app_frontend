import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {apiPost} from '../auth/appApi';
import {useAuth} from '../auth/useAuth';

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
            <div className="text-sm text-white">Signing out…</div>
        </div>
    );
}

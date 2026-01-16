import React, {useEffect, useMemo, useState} from 'react';
import type {AuthResponse} from './api';
import {apiGet, bindAuth} from './api';
import {AuthContext} from './AuthContext';

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [bootstrapped, setBootstrapped] = useState(false);

    const setSession = (session: AuthResponse | null) => {
        if (!session) {
            setUser(null);
            setAccessToken(null);
            return;
        }
        setUser(session.user);
        setAccessToken(session.accessToken);
    };

    const logout = () => setSession(null);

    useEffect(() => {
        bindAuth({
            getAccessToken: () => accessToken,
            setAccessToken: (t) => setAccessToken(t),
            onAuthFail: () => {
                setSession(null);
            },
        });
    }, [accessToken]);

    useEffect(() => {
        (async () => {
            try {
                const session = await apiGet<AuthResponse>('/auth/me');
                setSession(session);
            } catch {
                setSession(null);
            } finally {
                setBootstrapped(true);
            }
        })();
    }, []);

    const value = useMemo(
        () => ({user, accessToken, setSession, logout, bootstrapped}),
        [user, accessToken, bootstrapped],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

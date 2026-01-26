import {createContext} from 'react';
import type {AuthResponse} from './appApi';

export type AuthState = {
    user: AuthResponse['user'] | null;
    accessToken: string | null;
    bootstrapped: boolean;
    setSession: (session: AuthResponse | null) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);

import {useEffect, useState} from 'react';
import type {SubscriptionStatusResponse} from '../types/subscription';
import {apiGet} from '../auth/appApi';

export function useSubscriptionStatus() {
    const [data, setData] = useState<SubscriptionStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const res = await apiGet<SubscriptionStatusResponse>('/subscription/status');
                if (!cancelled) setData(res);
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        data,
        loading,
        error,
        refresh: async () => {
            const res = await apiGet<SubscriptionStatusResponse>('/subscription/status');
            setData(res);
        },
    };
}

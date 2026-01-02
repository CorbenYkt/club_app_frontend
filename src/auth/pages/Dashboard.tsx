import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {apiGet} from '../api';
import {useAuth} from '../useAuth';

function formatNZD(cents: number) {
    return new Intl.NumberFormat('en-NZ', {style: 'currency', currency: 'NZD'}).format(cents / 100);
}

export default function Dashboard() {
    const {accessToken} = useAuth();
    const [savedThisMonthCents, setSavedThisMonthCents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setError(null);
                setLoading(true);

                const r = await apiGet<{savedThisMonthCents: number}>(
                    `/redeem/summary?period=month`,
                    accessToken ?? undefined,
                );

                if (!alive) return;
                setSavedThisMonthCents(r.savedThisMonthCents ?? 0);
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : 'Failed to load');
                setSavedThisMonthCents(0);
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            alive = false;
        };
    }, [accessToken]);

    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-md px-4 py-6 space-y-4">
                <div className="rounded-2xl border bg-white p-5">
                    <div className="text-sm text-gray-600">Saved this month</div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {loading ? '…' : formatNZD(savedThisMonthCents)}
                        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                    </div>
                </div>
                <Link to="/scan" className="block rounded-2xl bg-black text-white p-5">
                    <div className="text-sm opacity-90">Quick action</div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">Scan QR</div>
                    <div className="mt-1 text-sm opacity-90">Scan a QR code</div>
                </Link>
            </div>
        </div>
    );
}

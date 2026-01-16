import {useEffect, useState} from 'react';
import type {SubscriptionStatusResponse} from '../../types/subscription';
import {apiGet, apiPost} from '../api';
import {Link} from 'react-router-dom';

type ActivateResponse = {
    ok: true;
    access: SubscriptionStatusResponse['access'];
    subscriptionPlan: 'MONTHLY';
    subscriptionEndsAt: string;
};

function Spinner() {
    return (
        <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
        />
    );
}

function formatNZDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('en-NZ', {dateStyle: 'medium', timeStyle: 'short'});
}

export function Renew() {
    const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setError(null);
                setPageLoading(true);
                const s = await apiGet<SubscriptionStatusResponse>('/subscription/status');
                if (!alive) return;
                setStatus(s);
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : 'Failed to load subscription status');
                setStatus(null);
            } finally {
                if (alive) setPageLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const activate = async () => {
        setLoading(true);
        try {
            const res = await apiPost<ActivateResponse>('/subscription/status');
            setStatus((prev) => (prev ? {...prev, access: res.access, subscriptionPlan: res.subscriptionPlan} : prev));
            window.location.assign('/dashboard');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to activate subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto w-full max-w-3xl px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="mono text-xs uppercase tracking-widest text-slate-500">Member area</div>
                    <h1 className="mt-2 text-3xl font-black tracking-tight">
                        Renew <span className="text-green-500">subscription</span>
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">Activate your monthly plan to keep redeeming deals.</p>
                </div>

                {/* Main card */}
                {/* Main card */}
                <div className="rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
                    {/* green accent */}
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-6">
                        {pageLoading ? (
                            <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                                <Spinner /> Loading subscription…
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        ) : !status ? (
                            <div className="text-sm text-slate-400">No subscription data.</div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Current access
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/40 px-3 py-1 text-xs text-slate-300">
                                                Status:{' '}
                                                <span className="ml-1 font-bold text-slate-100">
                                                    {status.access.kind}
                                                </span>
                                            </span>

                                            {status.access.kind !== 'EXPIRED' ? (
                                                <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/40 px-3 py-1 text-xs text-slate-300">
                                                    Days left:{' '}
                                                    <span className="ml-1 font-bold text-slate-100">
                                                        {status.access.daysLeft}
                                                    </span>
                                                </span>
                                            ) : null}
                                        </div>

                                        {status.access.kind === 'EXPIRED' ? (
                                            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                                                Your access has expired. Activate a monthly subscription to continue.
                                            </div>
                                        ) : (
                                            <div className="mt-4 text-sm text-slate-300">
                                                You still have access. You can extend it anytime.
                                            </div>
                                        )}

                                        {status.access.endsAt ? (
                                            <div className="mt-2 text-xs text-slate-500">
                                                Ends: {formatNZDateTime(status.access.endsAt)}
                                            </div>
                                        ) : null}
                                    </div>

                                    <Link
                                        to="/dashboard"
                                        className="shrink-0 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                        Back
                                    </Link>
                                </div>

                                <div className="mt-6 border-t border-slate-700 pt-5">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Plans
                                    </div>

                                    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-800/20 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-extrabold text-slate-100">Monthly</div>
                                                <div className="mt-1 text-xs text-slate-400">
                                                    1 month access. Renews manually for now.
                                                </div>
                                            </div>

                                            <button
                                                onClick={activate}
                                                disabled={loading}
                                                className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-extrabold transition ${
                                                    loading
                                                        ? 'cursor-not-allowed bg-slate-700 text-slate-300'
                                                        : 'bg-green-500 text-slate-950 hover:bg-green-400'
                                                }`}>
                                                {loading ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Spinner /> Activating…
                                                    </span>
                                                ) : (
                                                    'Comming soon'
                                                )}
                                            </button>

                                            {/* <button
                                            onClick={activate}
                                            disabled={loading}
                                            className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-extrabold transition ${
                                                loading
                                                    ? 'cursor-not-allowed bg-slate-700 text-slate-300'
                                                    : 'bg-green-500 text-slate-950 hover:bg-green-400'
                                            }`}>
                                            {loading ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <Spinner /> Activating…
                                                </span>
                                            ) : (
                                                'Activate 1 month'
                                            )}
                                        </button> */}
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-slate-500">
                                        Tip: after activation you’ll be redirected to your dashboard.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

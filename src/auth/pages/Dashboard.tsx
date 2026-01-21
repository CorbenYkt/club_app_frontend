import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {apiGet} from '../api';

type SubscriptionStatus = {
    access: {kind: 'TRIAL' | 'SUBSCRIPTION' | 'EXPIRED'; daysLeft: number; endsAt: string | null};
    subscriptionPlan?: string | null;
};

function splitNZD(cents: number) {
    const dollars = Math.floor(cents / 100);
    const remainder = Math.abs(cents % 100);
    return {
        dollars: dollars.toLocaleString('en-NZ'),
        cents: remainder.toString().padStart(2, '0'),
    };
}

function formatNZDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('en-NZ', {dateStyle: 'medium', timeStyle: 'short'});
}

function Spinner() {
    return (
        <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
        />
    );
}

type RecentRedeem = {
    id: string;
    createdAt: string;
    venue: {id: string; name: string; city: string | null; address: string | null; discountText: string};
};

export default function Dashboard() {
    const [sub, setSub] = useState<SubscriptionStatus | null>(null);
    const [subLoading, setSubLoading] = useState(true);
    const [subError, setSubError] = useState<string | null>(null);
    const [savedThisMonthCents, setSavedThisMonthCents] = useState(0);
    const [recent, setRecent] = useState<RecentRedeem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const isExpired = sub?.access.kind === 'EXPIRED';

    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                setError(null);
                setLoading(true);
                setSubLoading(true);
                setSubError(null);

                const [summary, recentRes, subRes] = await Promise.all([
                    apiGet<{savedThisMonthCents: number}>(`/redeem/summary?period=month`),
                    apiGet<{data: RecentRedeem[]}>(`/redeem/recent?limit=3`),
                    apiGet<SubscriptionStatus>(`/subscription/status`),
                ]);

                if (!alive) return;

                setSavedThisMonthCents(summary.savedThisMonthCents ?? 0);
                setRecent(recentRes.data ?? []);
                setSub(subRes);
                setSubError(null);
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : 'Failed to load');
                setSavedThisMonthCents(0);
                setRecent([]);
                setSub(null);
                setSubError(e instanceof Error ? e.message : 'Failed to load membership data');
            } finally {
                if (alive) {
                    setLoading(false);
                    setSubLoading(false);
                }
            }
        };

        load();

        const sp = new URLSearchParams(location.search);
        if (sp.get('refresh') === '1') {
            sp.delete('refresh');
            const next = `${location.pathname}${sp.toString() ? `?${sp.toString()}` : ''}`;
            navigate(next, {replace: true});
        }

        return () => {
            alive = false;
        };
    }, [location.search, location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto w-full max-w-6xl px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="mono text-xs uppercase tracking-widest text-slate-500">Member area</div>
                    <h1 className="mt-2 text-3xl font-black tracking-tight">
                        Your <span className="text-green-500">dashboard</span>
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">Track your savings and redeem deals at venues.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-start">
                    <div className="rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
                        {/* Green accent */}
                        <div className="h-1 w-full bg-green-500" />

                        <div className="p-6">
                            {/* header */}
                            <div className="mb-5">
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Saved this month
                                </div>
                                <h2 className="mt-2 text-2xl font-black tracking-tight">Your savings</h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Total discounts you’ve unlocked during the current month.
                                </p>
                            </div>
                            {/* content */}
                            <div className="space-y-4">
                                <div className="flex items-baseline text-5xl font-black mono text-green-400">
                                    {loading ? (
                                        <span>—</span>
                                    ) : (
                                        (() => {
                                            const {dollars, cents} = splitNZD(savedThisMonthCents);
                                            return (
                                                <>
                                                    <span>$</span>
                                                    <span>{dollars}</span>
                                                    <span className="mx-1 inline-block h-3 w-3 translate-y-1 rounded-full bg-green-500 animate-pulse" />
                                                    <span>{cents}</span>
                                                </>
                                            );
                                        })()
                                    )}
                                </div>

                                {loading && (
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/40 px-3 py-1 text-xs text-slate-300">
                                        <Spinner />
                                        loading
                                    </div>
                                )}
                            </div>

                            {error ? (
                                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            ) : null}

                            <div className="grid gap-3 mt-6 border-t border-slate-700 pt-5">
                                {/* Quick actions */}
                                <div className="mb-5">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Quick actions
                                    </div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight">Redeem a deal</h2>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Scan the venue QR code to verify membership and apply the member price.
                                    </p>
                                </div>

                                <div className="mb-5">
                                    <Link
                                        to={isExpired ? '/renew' : '/scan'}
                                        className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-4 text-center font-extrabold transition ${
                                            isExpired
                                                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                                : 'bg-green-500 text-slate-950 hover:bg-green-400'
                                        }`}>
                                        {isExpired ? 'Renew membership' : 'Scan QR'}
                                    </Link>

                                    <div className="pt-1 text-xs text-slate-500">No card needed — just your phone.</div>
                                </div>

                                {/* <Link
                                        to="/venues"
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                        Venues
                                    </Link> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Subscription */}
                        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                            <div className="flex items-start justify-between gap-4">
                                <div className="w-full">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Membership
                                    </div>

                                    {subLoading ? (
                                        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400">
                                            <Spinner /> loading
                                        </div>
                                    ) : subError ? (
                                        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                            {subError}
                                        </div>
                                    ) : !sub ? (
                                        <div className="mt-4 text-sm text-slate-400">No membership data</div>
                                    ) : (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-extrabold">
                                                    {sub.access.kind === 'TRIAL'
                                                        ? 'Free trial'
                                                        : sub.access.kind === 'SUBSCRIPTION'
                                                          ? 'Membership'
                                                          : 'Membership'}
                                                </div>
                                            </div>

                                            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/40 px-3 py-1 text-xs text-slate-300">
                                                Status: <span className="font-bold">{sub.access.kind}</span>
                                            </div>

                                            {sub.access.kind === 'EXPIRED' ? (
                                                <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                                                    Your access has expired.{' '}
                                                    <Link
                                                        to="/renew"
                                                        className="font-semibold underline underline-offset-4">
                                                        Renew now
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="mt-4 grid gap-2 text-sm text-slate-300">
                                                    <div>
                                                        Days left:{' '}
                                                        <span className="font-bold text-slate-100">
                                                            {sub.access.daysLeft}
                                                        </span>
                                                    </div>
                                                    {sub.access.endsAt ? (
                                                        <div className="text-xs text-slate-500">
                                                            Ends: {new Date(sub.access.endsAt).toLocaleString('en-NZ')}
                                                        </div>
                                                    ) : null}
                                                    <div className="text-xs text-slate-500">
                                                        Plan:{' '}
                                                        {sub.subscriptionPlan ??
                                                            (sub.access.kind === 'TRIAL' ? 'Trial' : '—')}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Redeems */}
                        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Recent redeems
                                </div>
                                <span className="text-xs text-slate-500">Last 3</span>
                            </div>

                            {loading ? (
                                <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
                                    <Spinner /> loading
                                </div>
                            ) : recent.length === 0 ? (
                                <div className="mt-3 text-sm text-slate-400">
                                    No redeems yet — scan a venue QR to get started.
                                </div>
                            ) : (
                                <div className="mt-3 grid gap-2">
                                    {recent.map((r) => (
                                        <div
                                            key={r.id}
                                            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-800/20 px-4 py-3">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-extrabold text-slate-100">
                                                    {r.venue.name}
                                                </div>
                                                {r.venue.discountText ? (
                                                    <div className="mt-1 line-clamp-1 text-xs text-slate-400">
                                                        {r.venue.discountText}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="shrink-0 text-xs text-slate-500">
                                                {formatNZDateTime(r.createdAt)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3 grid grid-cols-2 gap-3 items-start">
                                <Link
                                    to="/venues"
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                    Venues
                                </Link>

                                <Link
                                    to="/venues"
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                    Apply as a venue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import {useEffect, useState} from 'react';
import {fetchVenues, type Venue} from '../venues/api';
import {Link} from 'react-router-dom';
import {Spinner} from '../components/Spinner';

export default function VenuesPage() {
    const [q, setQ] = useState('');
    const [data, setData] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const query = q.trim();
    const hasQuery = query.length > 0;

    const load = async () => {
        if (loading) return;
        setLoading(true);
        setErr(null);

        try {
            const res = await fetchVenues({q: q.trim() || undefined, active: true});
            setData(res.data);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-8">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <div className="mono text-xs uppercase tracking-widest text-slate-500">Explore</div>
                                <h1 className="mt-3 text-3xl font-black tracking-tight">
                                    Venues <span className="text-green-500">Directory</span>
                                </h1>
                                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                                    Search by name, city, or address. See what member discount you get at each venue.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-6 sm:gap-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex-1">
                                    <label className="sr-only" htmlFor="venue-search">
                                        Search venues
                                    </label>
                                    <input
                                        id="venue-search"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                                        placeholder="Search by name / city / address"
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') void load();
                                        }}
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-green-400 disabled:opacity-60"
                                    onClick={() => void load()}
                                    disabled={loading || !hasQuery}>
                                    {loading ? (
                                        <>
                                            <Spinner /> Searching…
                                        </>
                                    ) : (
                                        'Search'
                                    )}
                                </button>
                            </div>

                            {err ? (
                                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {err}
                                </div>
                            ) : null}
                        </div>

                        <div className="mt-8 flex flex-col gap-6 sm:gap-6">
                            {loading ? (
                                <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-5 py-4 text-sm text-slate-300">
                                    Loading venues…
                                </div>
                            ) : data.length === 0 ? (
                                <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-5 py-4 text-sm text-slate-300">
                                    No venues found. Try a different search, or disable “active only”.
                                </div>
                            ) : (
                                data.map((v) => (
                                    <div
                                        key={v.id}
                                        className="rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                                        <Link to={`${v.id}`}>
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-lg font-semibold">{v.name}</div>
                                                        <div className="mt-1 text-sm text-slate-400">
                                                            {[v.city, v.address].filter(Boolean).join(' • ') || '—'}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={[
                                                            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold border',
                                                            v.isActive
                                                                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                                                : 'border-slate-600 bg-slate-800/40 text-slate-300',
                                                        ].join(' ')}>
                                                        {v.isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>

                                                <div className="mt-5 px-4 py-3">
                                                    <div className="mono text-[11px] uppercase tracking-widest text-slate-500">
                                                        Member discount
                                                    </div>
                                                    <div className="mt-1 text-sm font-semibold text-slate-100">
                                                        {v.discountText || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

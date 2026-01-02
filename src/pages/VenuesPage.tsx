import {useEffect, useState} from 'react';
import {fetchVenues, type Venue} from '../venues/api';

export default function VenuesPage() {
    const [q, setQ] = useState('');
    const [onlyActive, setOnlyActive] = useState(true);
    const [data, setData] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetchVenues({q: q.trim() || undefined, active: onlyActive});
            setData(res.data);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Failed to load venues');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, [onlyActive]);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Venues</h1>
                </div>

                <div className="mt-4 flex gap-3 items-center">
                    <input
                        className="flex-1 rounded-xl border p-3"
                        placeholder="Search by name/city/address"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') void load();
                        }}
                    />
                    <button
                        className="rounded-xl bg-indigo-600 text-white px-4 py-3 cursor-pointer"
                        onClick={() => void load()}>
                        Search
                    </button>
                </div>

                <label className="mt-3 inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
                    Show active only
                </label>

                {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

                <div className="mt-6 space-y-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : data.length === 0 ? (
                        <div className="text-sm text-gray-600">No venues found</div>
                    ) : (
                        data.map((v) => (
                            <div key={v.id} className="rounded-2xl border p-4 bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-lg font-semibold">{v.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {[v.city, v.address].filter(Boolean).join(' • ') || '—'}
                                        </div>
                                    </div>
                                    <div
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            v.isActive ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        {v.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>

                                <div className="mt-3 text-sm">
                                    <div className="text-gray-500">Member discount</div>
                                    <div className="font-medium">{v.discountText}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

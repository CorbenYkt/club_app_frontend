import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {applyVenue, type ApplyVenueBody} from '../venues/api';
import {Spinner} from '../components/Spinner';

export default function ApplyVenuePage() {
    const nav = useNavigate();

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [discountText, setDiscountText] = useState('');

    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const hasResult = ok;
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setErr(null);
        setOk(false);
        setLoading(true);

        try {
            const n = name.trim().replace(/\s+/g, ' ');
            const d = discountText.trim();

            if (n.length < 2) {
                setErr('Please enter a venue name.');
                return;
            }
            if (d.length < 2) {
                setErr('Please enter discount details.');
                return;
            }

            const body: ApplyVenueBody = {
                name: n,
                discountText: d,
                ...(city.trim() ? {city: city.trim()} : {}),
                ...(address.trim() ? {address: address.trim()} : {}),
            };

            await applyVenue(body);

            setOk(true);
            setName('');
            setCity('');
            setAddress('');
            setDiscountText('');
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 antialiased flex items-center justify-center px-6 py-12">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/60 shadow-2xl overflow-hidden">
                <div className="h-1 w-full bg-green-500" />

                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/" className="text-2xl font-extrabold tracking-tighter italic">
                            PULSE<span className="text-green-500">.</span>
                        </Link>
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                            Venue Application
                        </span>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 z-10 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-sm">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-slate-50" />
                                <span className="text-sm text-slate-200">Submitting…</span>
                            </div>
                        </div>
                    )}

                    <h1 className="text-3xl font-black tracking-tight leading-tight">Apply as a venue</h1>
                    <p className="mt-2 text-slate-400">
                        Tell us about your café and the discount you’d like to offer. We’ll review it and get back to
                        you.
                    </p>

                    {ok && (
                        <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                            Application submitted. We’ll review it and contact you soon.
                        </div>
                    )}

                    {err && (
                        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {err}
                        </div>
                    )}
                    {!hasResult && (
                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                    Venue name *
                                </label>
                                <input
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                    placeholder="Eg. Joe’s Coffee"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                        City
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                        placeholder="Wellington"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                    Address
                                </label>
                                <input
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                    placeholder="123 Cuba St"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                                    Discount text *
                                </label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
                                    placeholder="Eg. $1 off any coffee (members only)"
                                    value={discountText}
                                    onChange={(e) => setDiscountText(e.target.value)}
                                    disabled={loading}
                                    required
                                    rows={3}
                                />
                            </div>

                            <button
                                className="w-full rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 px-4 py-3 text-center font-extrabold uppercase tracking-tight transition-all transform hover:scale-[1.02] neon-glow cursor-pointer disabled:opacity-60"
                                disabled={loading}>
                                {loading ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <Spinner /> Submitting…
                                    </span>
                                ) : (
                                    'Submit application'
                                )}
                            </button>
                        </form>
                    )}
                    {hasResult && (
                        <div className="mt-6 grid gap-3">
                            <button
                                onClick={() => nav(-1)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-center text-slate-50 hover:bg-slate-800/50 transition">
                                Back
                            </button>

                            <Link
                                to="/dashboard"
                                className="w-full rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-center text-slate-50 hover:bg-slate-800/50 transition">
                                Go to dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

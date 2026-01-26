import {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {QRCodeCanvas} from 'qrcode.react';
import {apiGet, apiPost} from '../auth/appApi';
import {Spinner} from '../components/Spinner';

type QrResponse = {challenge: string; expiresInSec: number};
type VenueResponse = {id: string; name: string; city: string; address: string; discountText: string};

export default function VenueQrPage() {
    const {id} = useParams();
    const [venueName, setVenueName] = useState<string | null>(null);
    const [venueCity, setVenueCity] = useState<string | null>(null);
    const [venueAddress, setVenueAddress] = useState<string | null>(null);
    const [challenge, setChallenge] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [nextRefreshAt, setNextRefreshAt] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());
    const timerRef = useRef<number | null>(null);

    const redeemUrl = useMemo(() => {
        if (!challenge) return null;
        const base = window.location.origin;
        return `${base}/redeem?c=${encodeURIComponent(challenge)}`;
    }, [challenge]);

    const scheduleRefresh = (ms: number) => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => void load(), ms);
        setNextRefreshAt(Date.now() + ms);
    };

    const load = async () => {
        if (!id) return;

        setLoading(true);
        setErr(null);

        try {
            const res = await apiPost<QrResponse>(`/venues/${id}/qr`, {});
            setChallenge(res.challenge);

            const ms = Math.max(10_000, (res.expiresInSec - 10) * 1000);
            scheduleRefresh(ms);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Failed to generate QR');
            scheduleRefresh(10_000);
        } finally {
            setLoading(false);
        }
    };

    const loadVenue = async () => {
        if (!id) return;
        try {
            const v = await apiGet<VenueResponse>(`/venues/${id}`);
            setVenueName(v.name);
            setVenueCity(v.city);
            setVenueAddress(v.address);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Failed loading Venue name');
            setVenueName(null);
        }
    };

    useEffect(() => {
        void loadVenue();
        void load();
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [id]);

    useEffect(() => {
        const i = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(i);
    }, []);

    const secondsLeft = useMemo(() => {
        if (!nextRefreshAt) return null;
        return Math.max(0, Math.ceil((nextRefreshAt - now) / 1000));
    }, [nextRefreshAt, now]);

    return (
        <div className="min-h-dvh bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-8 text-center">
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Venue</div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {venueName ? (
                                <>
                                    {venueName} <span className="text-green-500">QR</span>
                                </>
                            ) : (
                                <>
                                    Venue <span className="text-green-500">QR</span>
                                </>
                            )}
                        </h1>
                        <p className="mt-3 text-sm font-black tracking-tight">
                            {[venueCity, venueAddress].filter(Boolean).join(', ')}
                        </p>

                        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                            This code refreshes automatically. Keep this screen open on the venue device.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/30 px-3 py-1 text-xs text-slate-300">
                            {loading ? (
                                <>
                                    <Spinner />
                                    Generating…
                                </>
                            ) : secondsLeft !== null ? (
                                <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Refresh in {secondsLeft}s
                                </>
                            ) : (
                                <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                    Ready
                                </>
                            )}
                        </div>

                        {err ? (
                            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-left">
                                {err}
                            </div>
                        ) : null}

                        <div className="mt-8 flex justify-center">
                            {redeemUrl ? (
                                <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-4">
                                    <div className="rounded-2xl bg-white p-3">
                                        <QRCodeCanvas value={redeemUrl} size={240} />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-5 py-4 text-sm text-slate-300">
                                    Loading QR…
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

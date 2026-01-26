import {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {QRCodeCanvas} from 'qrcode.react';
import {apiGet, apiPost, ApiError} from '../auth/appApi';
import {Spinner} from '../components/Spinner';

type VenueResponse = {id: string; name: string; city: string | null; address: string | null; discountText: string};
type QrStaticResponse = {challenge: string; expiresInSec: number};

function getRetryAfterSec(details: unknown): number | null {
    if (!details || typeof details !== 'object') return null;
    const v = (details as Record<string, unknown>).retryAfterSec;
    return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null;
}

export default function VenueStaticQrPage() {
    const {id} = useParams();
    const nav = useNavigate();
    const [sp] = useSearchParams();
    const isScan = sp.get('scan') === '1';

    const [venue, setVenue] = useState<VenueResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
    const [nowMs, setNowMs] = useState(() => Date.now());

    const inFlightRef = useRef(false);

    const cooldownStorageKey = useMemo(() => {
        return id ? `pulse:qrCooldownUntil:${id}` : null;
    }, [id]);

    const scanUrl = useMemo(() => {
        if (!id) return null;
        const base = window.location.origin;
        return `${base}/#/venues/${encodeURIComponent(id)}?scan=1`;
    }, [id]);

    const isInCooldown = cooldownUntilMs !== null && cooldownUntilMs > nowMs;

    const secondsLeft = useMemo(() => {
        if (!cooldownUntilMs) return 0;
        return Math.max(0, Math.ceil((cooldownUntilMs - nowMs) / 1000));
    }, [cooldownUntilMs, nowMs]);

    const setCooldown = (untilMs: number | null) => {
        setCooldownUntilMs(untilMs);

        setNowMs(Date.now());

        if (!cooldownStorageKey) return;

        if (untilMs && untilMs > Date.now()) {
            window.localStorage.setItem(cooldownStorageKey, String(untilMs));
        } else {
            window.localStorage.removeItem(cooldownStorageKey);
        }
    };

    useEffect(() => {
        if (!cooldownStorageKey) return;

        const raw = window.localStorage.getItem(cooldownStorageKey);
        const n = raw ? Number(raw) : NaN;

        if (Number.isFinite(n) && n > Date.now()) {
            setCooldownUntilMs(n);
            setNowMs(Date.now());
        } else {
            window.localStorage.removeItem(cooldownStorageKey);
            setCooldownUntilMs(null);
        }
    }, [cooldownStorageKey]);

    useEffect(() => {
        if (!isInCooldown) return;
        const i = window.setInterval(() => setNowMs(Date.now()), 250);
        return () => window.clearInterval(i);
    }, [isInCooldown]);

    useEffect(() => {
        if (cooldownUntilMs === null) return;
        if (cooldownUntilMs <= nowMs) {
            setCooldown(null);
        }
    }, [cooldownUntilMs, nowMs]);

    const loadVenue = async () => {
        if (!id) return;
        try {
            const v = await apiGet<VenueResponse>(`/venues/${id}`);
            setVenue(v);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Request failed');
            setVenue(null);
        }
    };

    const runScanFlow = async () => {
        if (!id) return;
        if (isInCooldown) return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;
        setLoading(true);
        setErr(null);

        try {
            const res = await apiPost<QrStaticResponse>(`/venues/${id}/qr-static`, {});
            nav(`/redeem?c=${encodeURIComponent(res.challenge)}`, {replace: true});
        } catch (e) {
            if (e instanceof ApiError && e.status === 429 && e.code === 'QR_COOLDOWN') {
                setErr(e.message);

                const retryAfterSec = getRetryAfterSec(e.details) ?? 30;
                setCooldown(Date.now() + retryAfterSec * 1000);
                return;
            }

            setErr(e instanceof Error ? e.message : 'Request failed');
        } finally {
            setLoading(false);
            inFlightRef.current = false;
        }
    };

    useEffect(() => {
        void loadVenue();
    }, [id]);

    useEffect(() => {
        if (!isScan) return;
        void runScanFlow();
    }, [id, isScan]);

    const buttonLabel = useMemo(() => {
        if (loading) return 'Checking…';
        if (isInCooldown) return `Try again (${secondsLeft}s)`;
        return 'Try again';
    }, [loading, isInCooldown, secondsLeft]);

    return (
        <div className="min-h-dvh bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-8 text-center">
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Venue</div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {venue?.name ? (
                                <>
                                    {venue.name} <span className="text-green-500">{isScan ? 'Scan' : 'QR'}</span>
                                </>
                            ) : (
                                <>
                                    Venue <span className="text-green-500">{isScan ? 'Scan' : 'QR'}</span>
                                </>
                            )}
                        </h1>

                        <p className="mt-3 text-sm font-black tracking-tight">
                            {[venue?.city, venue?.address].filter(Boolean).join(', ')}
                        </p>

                        {!isScan ? (
                            <>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                    This QR is permanent. You can print it and it will still work later.
                                </p>

                                <div className="mt-8 flex justify-center">
                                    {scanUrl ? (
                                        <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-4">
                                            <div className="rounded-2xl bg-white p-3">
                                                <QRCodeCanvas value={scanUrl} size={240} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-5 py-4 text-sm text-slate-300">
                                            Missing venue id
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">Processing your scan…</p>

                                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/30 px-3 py-1 text-xs text-slate-300">
                                    {loading ? (
                                        <>
                                            <Spinner />
                                            Checking…
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

                                        <button
                                            type="button"
                                            onClick={() => nav('/scan', {replace: true})}
                                            disabled={loading || isInCooldown}
                                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50 disabled:cursor-not-allowed disabled:opacity-60">
                                            {buttonLabel}
                                        </button>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

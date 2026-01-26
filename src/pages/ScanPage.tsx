import {useEffect, useRef, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Html5Qrcode} from 'html5-qrcode';

type ScanResult = {kind: 'challenge'; challenge: string} | {kind: 'venue'; venueId: string} | {kind: 'unknown'};

function extractScanResult(qrText: string): ScanResult {
    const raw = qrText.trim();

    try {
        const u = new URL(raw);

        const c = u.searchParams.get('c')?.trim();
        if (c) return {kind: 'challenge', challenge: c};

        const token = u.searchParams.get('token')?.trim();
        if (token) return {kind: 'challenge', challenge: token};

        const venueId = extractVenueIdFromUrl(u);
        if (venueId) return {kind: 'venue', venueId};

        return {kind: 'unknown'};
    } catch {
        // not a URL, continue
    }

    try {
        const qs = raw.startsWith('?') ? raw : `?${raw}`;
        const sp = new URLSearchParams(qs);

        const c = sp.get('c')?.trim();
        if (c) return {kind: 'challenge', challenge: c};

        const token = sp.get('token')?.trim();
        if (token) return {kind: 'challenge', challenge: token};
    } catch {
        // ignore
    }

    if (/^[A-Za-z0-9_-]{16,}$/.test(raw)) return {kind: 'challenge', challenge: raw};

    return {kind: 'unknown'};
}

function extractVenueIdFromUrl(u: URL): string | null {
    const hash = u.hash?.startsWith('#') ? u.hash.slice(1) : '';
    const candidatePaths: string[] = [];

    if (hash) candidatePaths.push(hash);
    candidatePaths.push(u.pathname + u.search);

    for (const p of candidatePaths) {
        const [pathOnly] = p.split('?');
        const path = pathOnly || '';

        const m = path.match(/^\/venues\/([^/]+)$/);
        if (!m) continue;

        const id = m[1]?.trim();
        if (id) return id;
    }

    return null;
}

export default function ScanPage() {
    const nav = useNavigate();
    const [err, setErr] = useState<string | null>(null);
    const [restarting, setRestarting] = useState(false);

    const qrRefId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
    const qrRef = useRef<Html5Qrcode | null>(null);
    const startedRef = useRef(false);
    const scannedRef = useRef(false);
    const cancelledRef = useRef(false);

    const startScanner = async () => {
        const qr = qrRef.current;
        if (!qr) return;

        await qr.start(
            {facingMode: 'environment'},
            {fps: 10, qrbox: {width: 260, height: 260}},
            async (decodedText) => {
                if (cancelledRef.current || scannedRef.current) return;

                const result = extractScanResult(decodedText);

                if (result.kind === 'unknown') {
                    setErr('This QR code is not a Pulse Club code.');
                    return;
                }

                scannedRef.current = true;

                try {
                    await stopSafely(qr);
                } catch (e) {
                    console.warn('stopSafely unexpected:', e);
                }

                if (result.kind === 'challenge') {
                    nav(`/redeem?c=${encodeURIComponent(result.challenge)}`, {replace: true});
                } else {
                    // venue static QR
                    nav(`/venues/${encodeURIComponent(result.venueId)}?scan=1`, {replace: true});
                }
            },
            () => {},
        );
    };

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const qr = new Html5Qrcode(qrRefId.current);
        qrRef.current = qr;

        (async () => {
            try {
                setErr(null);
                await startScanner();
            } catch (e) {
                if (!cancelledRef.current) setErr('Could not start camera. Please allow camera access.');
                console.error(e);
            }
        })();

        return () => {
            cancelledRef.current = true;
            const current = qrRef.current;
            qrRef.current = null;

            void stopSafely(current);
        };
    }, [nav]);

    async function stopSafely(qr: Html5Qrcode | null) {
        if (!qr) return;

        try {
            await Promise.resolve(qr.stop());
        } catch (e) {
            console.warn('stopSafely ignored:', e);
        }

        try {
            qr.clear();
        } catch (e) {
            console.warn('clear() ignored:', e);
        }
    }

    const onTryAgain = async () => {
        if (restarting) return;

        setRestarting(true);
        setErr(null);
        scannedRef.current = false;

        try {
            await stopSafely(qrRef.current);
            await startScanner();
        } catch (e) {
            console.error(e);
            setErr('Could not restart camera. Please check permissions and try again.');
        } finally {
            setRestarting(false);
        }
    };

    return (
        <div className="min-h-dvh bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-8">
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Quick action</div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            Scan venue <span className="text-green-500">QR</span>
                        </h1>

                        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                            Point your camera at the QR code displayed at the venue. We’ll verify your membership and
                            open the redeem screen.
                        </p>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/30">
                            <div className="p-3">
                                <div className="rounded-2xl border border-slate-700 bg-slate-950/40">
                                    <div id={qrRefId.current} className="w-full" />
                                </div>
                            </div>
                        </div>

                        {err ? (
                            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                <div>{err}</div>

                                <button
                                    type="button"
                                    onClick={onTryAgain}
                                    disabled={restarting}
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-4 py-2 font-extrabold text-slate-950 transition hover:bg-green-400 disabled:opacity-60">
                                    {restarting ? 'Restarting…' : 'Try again'}
                                </button>
                            </div>
                        ) : (
                            <p className="mt-4 text-xs text-slate-500">
                                Tip: If you don’t see the camera preview, check browser permissions.
                            </p>
                        )}

                        <div className="mt-6 grid gap-3">
                            <Link
                                to="/"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

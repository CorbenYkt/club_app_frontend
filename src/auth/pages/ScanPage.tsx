import {useEffect, useRef, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Html5Qrcode} from 'html5-qrcode';

function extractChallenge(qrText: string): string | null {
    const raw = qrText.trim();

    try {
        const u = new URL(raw);
        const c = u.searchParams.get('c');
        if (c) return c.trim();

        const token = u.searchParams.get('token');
        if (token) return token.trim();

        return null;
    } catch {
        //void(0)
    }

    try {
        const qs = raw.startsWith('?') ? raw : `?${raw}`;
        const sp = new URLSearchParams(qs);

        const c = sp.get('c');
        if (c) return c.trim();

        const token = sp.get('token');
        if (token) return token.trim();
    } catch {
        // void(0)
    }

    if (/^[A-Za-z0-9_-]{16,}$/.test(raw)) return raw;

    return null;
}

// function extractToken(qrText: string): string | null {
//     const raw = qrText.trim();

//     try {
//         const u = new URL(raw);
//         const t = u.searchParams.get('token');
//         if (t) return t.trim();
//     } catch {
//         // not a URL
//     }

//     if (raw.length >= 16 && !raw.includes(' ')) return raw;

//     const m = raw.match(/token=([^&\s]+)/i);
//     return m?.[1]?.trim() ?? null;
// }

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

                const challenge = extractChallenge(decodedText);
                if (!challenge) {
                    setErr('This QR code is not a Pulse Club code.');
                    return;
                }

                scannedRef.current = true;

                try {
                    await stopSafely(qr);
                } catch (e) {
                    console.warn('stopSafely unexpected:', e);
                }

                nav(`/redeem?c=${encodeURIComponent(challenge)}`, {replace: true});
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

            // if (!current) return;

            // current
            //     .stop()
            //     .catch((e) => console.warn('stop() on cleanup ignored:', e))
            //     .finally(() => {
            //         try {
            //             current.clear();
            //         } catch (e) {
            //             console.warn('clear() on cleanup ignored:', e);
            //         }
            //     });
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
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto max-w-6xl px-6 py-10">
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

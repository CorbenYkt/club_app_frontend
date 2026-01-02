import {useEffect, useRef, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Html5Qrcode} from 'html5-qrcode';

function extractToken(qrText: string): string | null {
    const raw = qrText.trim();

    try {
        const u = new URL(raw);
        const t = u.searchParams.get('token');
        if (t) return t.trim();
    } catch {
        // not a URL
    }

    if (raw.length >= 16 && !raw.includes(' ')) return raw;

    const m = raw.match(/token=([^&\s]+)/i);
    return m?.[1]?.trim() ?? null;
}

export default function ScanPage() {
    const nav = useNavigate();
    const [err, setErr] = useState<string | null>(null);

    const qrRefId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
    const qrRef = useRef<Html5Qrcode | null>(null);
    const startedRef = useRef(false);
    const scannedRef = useRef(false);
    const cancelledRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const qr = new Html5Qrcode(qrRefId.current);
        qrRef.current = qr;

        (async () => {
            try {
                await qr.start(
                    {facingMode: 'environment'},
                    {fps: 10, qrbox: {width: 260, height: 260}},
                    async (decodedText) => {
                        if (cancelledRef.current || scannedRef.current) return;
                        console.log('[QR decodedText]', decodedText);
                        const token = extractToken(decodedText);
                        console.log('[QR token]', token);
                        if (!token) {
                            setErr('This QR code is not a PulseClub code.');
                            return;
                        }

                        scannedRef.current = true;

                        try {
                            await qr.stop();
                        } catch (e) {
                            console.warn('qr.stop() ignored:', e);
                        }
                        nav(`/redeem?token=${encodeURIComponent(decodedText)}`, {replace: true});
                    },
                    () => {},
                );
            } catch (e) {
                if (!cancelledRef.current) setErr('Could not start camera');
                console.error(e);
            }
        })();

        return () => {
            cancelledRef.current = true;
            const current = qrRef.current;
            qrRef.current = null;

            if (!current) return;

            current
                .stop()
                .catch((e) => console.warn('stop() on cleanup ignored:', e))
                .finally(() => {
                    try {
                        current.clear();
                    } catch (e) {
                        console.warn('clear() on cleanup ignored:', e);
                    }
                });
        };
    }, [nav]);

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-56px)]">
            <div className="mx-auto max-w-md px-4 py-6 space-y-4">
                <div className="rounded-2xl border bg-white p-5">
                    <div className="text-lg font-semibold text-gray-900">Scan venue QR</div>
                    <div className="mt-1 text-sm text-gray-600">
                        Point your camera at the QR code displayed at the venue.
                    </div>

                    <div className="mt-4 overflow-hidden rounded-2xl border bg-black/5">
                        <div id={qrRefId.current} className="w-full" />
                    </div>

                    {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}

                    <div className="mt-4 grid gap-2">
                        <Link to="/" className="w-full rounded-2xl border p-3 text-center hover:bg-gray-50">
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

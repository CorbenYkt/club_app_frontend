import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {QRCodeCanvas} from 'qrcode.react';
import {apiPost} from '../auth/api';

type QrResponse = {challenge: string; expiresInSec: number};

export default function VenueQrPage() {
    const {id} = useParams();
    const [challenge, setChallenge] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const redeemUrl = useMemo(() => {
        if (!challenge) return null;
        const base = window.location.origin;
        return `${base}/redeem?c=${encodeURIComponent(challenge)}`;
    }, [challenge]);

    useEffect(() => {
        let t: number | undefined;

        const load = async () => {
            if (!id) return;
            try {
                setErr(null);
                const res = await apiPost<QrResponse>(`/venues/${id}/qr`, {});
                setChallenge(res.challenge);

                t = window.setTimeout(load, Math.max(10_000, (res.expiresInSec - 10) * 1000));
            } catch (e) {
                setErr(e instanceof Error ? e.message : 'Failed to generate QR');
                t = window.setTimeout(load, 10_000);
            }
        };

        void load();

        return () => {
            if (t) window.clearTimeout(t);
        };
    }, [id]);

    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 text-center">
                <h1 className="text-2xl font-semibold">Venue QR</h1>
                <p className="mt-2 text-sm text-gray-600">This code refreshes automatically.</p>

                {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

                <div className="mt-6 flex justify-center">
                    {redeemUrl ? (
                        <div className="rounded-2xl border p-4">
                            <QRCodeCanvas value={redeemUrl} size={240} />
                        </div>
                    ) : (
                        <div>Loading QR…</div>
                    )}
                </div>

                {/* {redeemUrl && <div className="mt-4 text-xs text-gray-500 break-all">{redeemUrl}</div>} */}
            </div>
        </div>
    );
}

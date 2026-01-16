import {useEffect, useMemo, useRef, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {apiPost} from '../auth/api';
import {useAuth} from '../auth/useAuth';

type VerifyResponse =
    | {
          approved: true;
          venue: {id: string; name: string; city: string | null; address: string | null; discountText: string};
          savedCents?: number;
      }
    | {approved: false; reason: string};

function getChallengeFromSearchParams(sp: URLSearchParams): string | null {
    const c = sp.get('c');
    if (c) return c;

    const token = sp.get('token');
    if (!token) return null;

    try {
        const u = new URL(token);
        return u.searchParams.get('c');
    } catch {
        if (/^[A-Za-z0-9_-]{16,}$/.test(token)) return token;
        return null;
    }
}

function friendlyReason(reason: string) {
    switch (reason) {
        case 'expired_or_invalid':
            return {
                title: 'QR expired',
                body: 'Ask the venue to refresh the QR and scan again.',
            };
        case 'venue_inactive':
            return {
                title: 'Venue unavailable',
                body: 'This venue is not active right now. Please try another venue.',
            };
        default:
            return {
                title: 'Not approved',
                body: `Reason: ${reason}`,
            };
    }
}

function Spinner() {
    return (
        <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden="true"
        />
    );
}

export default function RedeemPage() {
    const [sp] = useSearchParams();
    const {user, bootstrapped} = useAuth();

    const challenge = useMemo(() => getChallengeFromSearchParams(sp), [sp]);

    const [state, setState] = useState<'idle' | 'loading' | 'approved' | 'denied'>('idle');
    const [message, setMessage] = useState<string>('');
    const [venueName, setVenueName] = useState<string | null>(null);
    const [reason, setReason] = useState<string | null>(null);
    const verifyingRef = useRef<string | null>(null);

    useEffect(() => {
        if (!bootstrapped) return;

        if (!challenge) {
            setState('denied');
            setMessage('Missing QR token.');
            return;
        }

        if (!user) {
            setState('denied');
            setMessage('Please sign in first.');
            return;
        }

        if (verifyingRef.current === challenge) return;
        verifyingRef.current = challenge;

        let cancelled = false;

        (async () => {
            setState('loading');
            setMessage('Verifying membership…');
            setVenueName(null);
            setReason(null);

            try {
                const res = await apiPost<VerifyResponse>('/redeem/verify', {challenge});

                if (cancelled) return;

                if (res.approved) {
                    setState('approved');
                    setVenueName(res.venue.name);
                    setMessage('Approved! Show this screen to the cashier to get the member price.');
                } else {
                    setState('denied');
                    setReason(res.reason);

                    const fr = friendlyReason(res.reason);
                    setMessage(`${fr.title}. ${fr.body}`);
                }
            } catch (e) {
                if (cancelled) return;
                setState('denied');
                setMessage(e instanceof Error ? e.message : 'Verification failed');
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [bootstrapped, user, challenge]);

    const isApproved = state === 'approved';
    const isDenied = state === 'denied';

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    {/* Accent bar */}
                    <div
                        className={`h-1 w-full ${isApproved ? 'bg-green-500' : isDenied ? 'bg-red-400' : 'bg-green-500'}`}
                    />

                    <div className="p-8">
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Redeem</div>

                        {state === 'loading' ? (
                            <>
                                <h1 className="mt-3 text-3xl font-black tracking-tight">
                                    Checking <span className="text-green-500">membership</span>
                                </h1>

                                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-sm text-slate-200">
                                    <Spinner />
                                    <span>{message}</span>
                                </div>
                            </>
                        ) : isApproved ? (
                            <>
                                <h1 className="mt-3 text-3xl font-black tracking-tight">
                                    <span className="text-green-500">Approved</span>
                                </h1>

                                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{message}</p>

                                {venueName ? (
                                    <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                                        Venue: <span className="font-extrabold">{venueName}</span>
                                    </div>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <h1 className="mt-3 text-3xl font-black tracking-tight">
                                    Not <span className="text-green-500">approved</span>
                                </h1>

                                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{message}</p>

                                {reason ? (
                                    <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                        Code: <span className="font-mono">{reason}</span>
                                    </div>
                                ) : null}
                            </>
                        )}

                        <div className="mt-8 grid gap-3">
                            <Link
                                to="/dashboard?refresh=1"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-green-400">
                                Back to Dashboard
                            </Link>

                            <Link
                                to="/scan"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                Scan again
                            </Link>

                            <div className="pt-1 text-center text-xs text-slate-500">
                                No card needed — just your phone.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

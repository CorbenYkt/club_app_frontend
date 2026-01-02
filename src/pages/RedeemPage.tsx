import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {apiPost} from '../auth/api';
import {useAuth} from '../auth/useAuth';

type VerifyResponse =
    | {
          approved: true;
          venue: {id: string; name: string; city: string | null; address: string | null; discountText: string};
      }
    | {approved: false; reason: string};

export default function RedeemPage() {
    const [sp] = useSearchParams();
    const challenge = sp.get('c');
    const {accessToken} = useAuth();

    const [state, setState] = useState<'idle' | 'loading' | 'approved' | 'denied'>('idle');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        (async () => {
            if (!challenge) {
                setState('denied');
                setMessage('Missing QR token.');
                return;
            }
            if (!accessToken) {
                setState('denied');
                setMessage('Please sign in first.');
                return;
            }

            setState('loading');
            try {
                const res = await apiPost<VerifyResponse>('/redeem/verify', {challenge}, accessToken);

                if (res.approved) {
                    setState('approved');
                    setMessage(`Approved! Show this to the cashier at ${res.venue.name}.`);
                } else {
                    setState('denied');
                    setMessage(`Not approved: ${res.reason}`);
                }
            } catch (e) {
                setState('denied');
                setMessage(e instanceof Error ? e.message : 'Verification failed');
            }
        })();
    }, [challenge, accessToken]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 text-center">
                {state === 'loading' && <h1 className="text-2xl font-semibold">Checking…</h1>}
                {state === 'approved' && <h1 className="text-2xl font-semibold">✅ Approved</h1>}
                {state === 'denied' && <h1 className="text-2xl font-semibold">❌ Not approved</h1>}

                <div className="mt-3 text-sm text-gray-700">{message}</div>
            </div>
        </div>
    );
}

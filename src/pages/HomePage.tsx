import {useAuth} from '../auth/useAuth';
import {Link, Navigate} from 'react-router-dom';

const features = [
    {
        emoji: '🎯',
        title: 'Member Rates, No Fuss',
        text: 'Forget coupon awkwardness. You’re a member of the club. Flash your pass, get the member rate, and get on with your day.',
    },
    {
        emoji: '🛡️',
        title: 'Supporting Independent Spots',
        text: 'We partner with the independent cafes and bars you already love across the CBD. No corporate chains, no middlemen. Your money stays with the people behind the counter.',
    },
    {
        emoji: '🏪',
        title: 'The Real Math',
        text: 'Watch your savings add up in real time on your dashboard. Use it just twice a week, and the pass pays for itself several times over.',
    },
] as const;

const faqs = [
    {
        question: 'What is Pulse Club?',
        answer: 'Pulse Club is a simple way to get discounts at participating venues. Sign in, scan the venue QR code, and redeem your deal.',
        emoji: '✨',
    },
    {
        question: 'Do I need a plastic membership card?',
        answer: 'No. Everything lives in your account. Your phone is all you need.',
        emoji: '📱',
    },
    {
        question: 'Is it free?',
        answer: 'Yes — free during Soft Launch (90 days).',
        emoji: '🆓',
    },
    {
        question: 'How do I redeem a discount?',
        answer: 'Open the scanner, scan the venue QR code, and follow the on-screen instructions.',
        emoji: '🔎',
    },
] as const;

export default function HomePage() {
    const {user} = useAuth();

    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className="min-h-screen antialiased">
            <div className="space-y-20">
                <section className="px-6 pt-20 pb-20 max-w-4xl mx-auto text-center">
                    <div className="inline-block px-4 py-1 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        Soft Launch: 90 Days Free
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
                        Your city, <br />
                        <span className="text-green-500">better prices.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Living costs are rising, so we’re making it easier to manage. Join our Soft Launch and get{' '}
                        <span className="text-white font-bold">3 months of member rates for FREE</span>. No credit card
                        needed. Just scan the Pulse QR at the counter of independent local spots and pay less for your
                        daily coffee, lunch, or pint.
                    </p>

                    <div className="flex flex-col items-center space-y-4">
                        <Link
                            to="/login"
                            className="w-full md:w-auto px-10 py-5 bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold text-xl rounded-xl transition-all transform hover:scale-105 neon-glow uppercase tracking-tight text-center">
                            Claim My Free 90 Days
                        </Link>

                        <p className="text-xs text-slate-500 flex items-center">
                            <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            No credit card required. Setup takes 30 seconds.
                        </p>
                    </div>
                </section>
                <section className="bg-slate-800/30 border-y border-slate-800 px-6 pt-20 pb-20">
                    <h2 className="text-3xl font-black text-center uppercase tracking-tighter mb-4">Why Pulse Club?</h2>
                    <p className="text-slate-400 text-center mb-12">Three reasons people stick with it.</p>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                                    <div className="w-12 h-12 bg-slate-300/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <span className="text-2xl">{f.emoji}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white text-center">{f.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-center">{f.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="px-6 pt-20 pb-20 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-black text-center uppercase tracking-tighter mb-4">
                        CBD Living, Simplified
                    </h2>
                    <p className="text-slate-400 text-center mb-12">Three steps to start saving right away.</p>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="relative">
                            <div className="step-number mono font-bold mb-4">01</div>
                            <h3 className="text-xl font-bold mb-3">Get the Pass</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Sign up in seconds. No payment details required during Soft Launch.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="step-number mono font-bold mb-4">02</div>
                            <h3 className="text-xl font-bold mb-3 text-green-500">Find the QR</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Look for the Pulse QR at the counter of your favourite independent cafes and bars.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="step-number mono font-bold mb-4">03</div>
                            <h3 className="text-xl font-bold mb-3">Pay the Member Price</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Scan to verify your membership and pay the member rate{' '}
                                <span className="text-white font-semibold">directly to the venue</span>. We don’t handle
                                your money.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="bg-slate-800/30 border-y border-slate-800 px-6 pt-20 pb-20">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-black leading-tight mb-8">
                                Member rates, <br /> no fuss.
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="mt-1 mr-4 text-green-500 font-bold mono">/01</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Supporting Independent Spots</h4>
                                        <p className="text-slate-400">
                                            We partner with independent cafes and bars you actually visit. No corporate
                                            chains, no middlemen.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="mt-1 mr-4 text-green-500 font-bold mono">/02</div>
                                    <div>
                                        <h4 className="font-bold mb-1">The Real Math</h4>
                                        <p className="text-slate-400">
                                            Track your savings in real time. Use it twice a week, and the pass pays for
                                            itself several times over.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <span className="mono text-xs text-slate-500 uppercase">Your personal dashboard</span>
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            </div>

                            <div className="space-y-4">
                                <div className="text-sm text-slate-400">Saved this month:</div>
                                <div className="text-5xl font-black mono text-green-400">$24.50</div>
                                <div className="h-1 w-full bg-slate-800 rounded-full mt-6">
                                    <div className="w-3/4 h-full bg-green-500" />
                                </div>
                                <p className="text-xs text-slate-500 italic mt-4">Calculated from 8 scans.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="px-6 pt-20 pb-20 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-black text-center uppercase tracking-tighter mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-400 text-center mb-12">Quick answers before you start.</p>

                    <div className="space-y-4">
                        {faqs.map((item) => (
                            <details
                                key={item.question}
                                className="rounded-2xl border border-slate-700 bg-slate-900/40">
                                <summary className="cursor-pointer select-none px-6 py-5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{item.emoji}</span>
                                        <span className="font-semibold text-white">{item.question}</span>
                                    </div>
                                    <span className="text-slate-500 transition-transform group-open:rotate-180">⌄</span>
                                </summary>
                                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">{item.answer}</div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

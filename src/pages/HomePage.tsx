import {Link} from 'react-router-dom';
import {useAuth} from '../auth/useAuth';
import DashboardPage from '../auth/pages/Dashboard';

const features = [
    {
        emoji: '🎯',
        title: 'Simple & fast',
        text: 'Sign in, scan a venue QR, and redeem your discount in seconds',
        bg: 'bg-blue-50',
    },
    {
        emoji: '🛡️',
        title: 'No hassle',
        text: 'No cards to carry, no coupons to print — just your phone',
        bg: 'bg-green-50',
    },
    {
        emoji: '🏪',
        title: 'Local & authentic',
        text: 'Support New Zealand venues while saving money every time you go',
        bg: 'bg-purple-50',
    },
    {
        emoji: '💸',
        title: 'Track savings',
        text: 'See how much you’ve saved over time — keep it motivating',
        bg: 'bg-orange-50',
    },
] as const;

const faqs = [
    {
        question: 'What is PulseClub?',
        answer: 'PulseClub is a simple way to get venue discounts. You sign in, scan the venue QR, and redeem your deal',
        emoji: '✨',
    },
    {
        question: 'Do I need a plastic membership card?',
        answer: 'No. Everything lives in your account. Your phone is all you need',
        emoji: '📱',
    },
    {
        question: 'Is it free?',
        answer: 'Yes — it’s free for now. Sign up and start getting discounts right away.',
        emoji: '🆓',
    },
    {
        question: 'How do I redeem a discount?',
        answer: 'Open the scanner, scan the venue QR code, and follow the on-screen instructions',
        emoji: '🔎',
    },
] as const;

export default function HomePage() {
    const {user, bootstrapped} = useAuth();
    if (!bootstrapped) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="rounded-2xl border bg-white p-5 text-sm text-gray-600">Loading…</div>
            </div>
        );
    }

    if (user) return <DashboardPage />;

    return (
        <div className="bg-gray-50">
            {/* HERO */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
                <div className="space-y-6 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        <span className="relative inline-block">
                            <span className="absolute -inset-2 rounded-2xl bg-linear-to-r from-slate-900/15 via-indigo-700/15 to-violet-700/15 blur-xl animate-pulse" />
                            <span className="relative bg-linear-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                                Save money at local venues
                                <br />
                                with a quick QR scan
                            </span>
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        PulseClub is built for real life in New Zealand: authentic venues, simple discounts, and a clean
                        experience. Sign in, scan a venue QR, redeem your deal — done.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 sm:max-w-md mx-auto">
                        <Link
                            to="/login"
                            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white
             shadow-sm transition
             hover:bg-indigo-700
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="w-full rounded-2xl border bg-white px-4 py-3 text-center font-medium hover:bg-gray-50">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
            {/* WHY */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Why PulseClub?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We’re making discounts simple, authentic, and easy to use on your phone.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                            <div
                                className={`w-12 h-12 ${f.bg} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                                <span className="text-2xl">{f.emoji}</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-gray-600 text-sm">{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* FAQ */}
            <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mt-2">Quick answers before you start</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((item) => (
                        <details key={item.question} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                            <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.emoji}</span>
                                    <span className="font-medium text-gray-900">{item.question}</span>
                                </div>
                                <span className="text-gray-500">⌄</span>
                            </summary>
                            <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{item.answer}</div>
                        </details>
                    ))}
                </div>
            </div>
            {/* CTA */}
            <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ready to start saving with PulseClub?</h2>
                <p className="text-gray-600">Create an account, find a venue, scan the QR, and redeem your discount.</p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                        to="/register"
                        className="rounded-2xl bg-indigo-600 text-white px-5 py-3 font-medium hover:opacity-95">
                        Create account
                    </Link>
                    <Link to="/login" className="rounded-2xl border bg-white px-5 py-3 font-medium hover:bg-gray-50">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

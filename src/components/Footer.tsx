import {Link} from 'react-router-dom';

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-900">
            <div className="mx-auto max-w-6xl px-6 py-14">
                {/* top accent */}
                <div className="mb-10 h-1 w-16 rounded-full bg-green-500" />

                <div className="grid gap-10 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="text-xl font-extrabold tracking-tighter italic text-slate-100">
                            PULSE<span className="text-green-500">.</span>
                        </div>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                            Simple local discounts for cafés, bars, and venues across New Zealand.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Product</div>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-slate-300 hover:text-green-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-slate-300 hover:text-green-500 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-slate-300 hover:text-green-500 transition-colors">
                                    Member Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-slate-300 hover:text-green-500 transition-colors">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Contact</div>
                        <p className="mt-4 text-sm text-slate-400">
                            Support:{' '}
                            <a
                                href="mailto:pulseclubnz@gmail.com"
                                className="text-slate-300 hover:text-green-500 transition-colors">
                                pulseclubnz@gmail.com
                            </a>
                        </p>

                        <p className="mt-3 text-xs text-slate-500">We usually reply within 24–48 hours.</p>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-8 md:flex-row md:items-center md:justify-between">
                    <div className="text-xs text-slate-600 mono">Pulse Club © 2026 | Built for Welly, by Welly</div>

                    <div className="flex items-center gap-4 text-xs">
                        {/* <Link to="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
                        <Link to="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link> */}
                        <a
                            href="mailto:pulseclubnz@gmail.com"
                            className="text-slate-500 hover:text-slate-300 transition-colors">
                            Email support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

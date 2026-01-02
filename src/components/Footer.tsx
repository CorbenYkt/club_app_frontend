import {Link} from 'react-router-dom';

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <p className="text-lg font-semibold text-gray-900">PulseClub</p>
                        <p className="mt-2 max-w-sm text-sm text-gray-600">
                            Simple local discounts for cafés, bars, and venues across New Zealand.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Product</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">
                                    Login
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition">
                                    Privacy
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Contact</p>
                        <p className="mt-3 text-sm text-gray-600">
                            Support:{' '}
                            <a href="mailto:support@pulseclub.co.nz" className="hover:text-gray-900 transition">
                                support@pulseclub.co.nz
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} PulseClub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

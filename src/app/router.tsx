import {createHashRouter} from 'react-router-dom';
import {ProtectedRoute} from '../auth/ProtectedRoute';
import ForgotPasswordPage from '../auth/pages/ForgotPasswordPage';
import LoginPage from '../auth/pages/LoginPage';
import ResetPasswordPage from '../auth/pages/ResetPasswordPage';
import HomePage from '../pages/HomePage';
import VenuesPage from '../pages/VenuesPage';
import RedeemPage from '../pages/RedeemPage';
import VenueQrPage from '../pages/VenueQrPage';
import RegisterPage from '../pages/RegisterPage';
import RootLayout from '../layouts/RootLayout';
import LogoutPage from '../auth/pages/LogoutPage';
// import {NotFound} from '../auth/pages/NotFound';
import DashboardPage from '../auth/pages/Dashboard';
import ScanPage from '../auth/pages/ScanPage';
import {DebugError} from '../auth/pages/DebugError';
import {Renew} from '../auth/pages/Renew';

export const router = createHashRouter([
    {
        element: <RootLayout />,
        // errorElement: <NotFound />,
        errorElement: <DebugError />,

        children: [
            {path: '/login', element: <LoginPage />},
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/scan',
                element: (
                    <ProtectedRoute>
                        <ScanPage />
                    </ProtectedRoute>
                ),
            },
            {path: '/forgot-password', element: <ForgotPasswordPage />},
            {path: '/reset-password', element: <ResetPasswordPage />},
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/venues',
                element: (
                    <ProtectedRoute>
                        <VenuesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/venues/:id/qr',
                element: <VenueQrPage />,
            },
            {
                path: '/redeem',
                element: (
                    <ProtectedRoute>
                        <RedeemPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
            {
                path: '/logout',
                element: (
                    <ProtectedRoute>
                        <LogoutPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/renew',
                element: <Renew />,
            },

            // {
            //     path: '*',
            //     element: <NotFound />,
            // },
        ],
    },
]);

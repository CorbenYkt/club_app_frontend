import {createHashRouter} from 'react-router-dom';
import {ProtectedRoute} from '../auth/ProtectedRoute';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import LoginPage from '../pages/LoginPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import HomePage from '../pages/HomePage';
import VenuesPage from '../pages/VenuesPage';
import RedeemPage from '../pages/RedeemPage';
import VenueQrPage from '../pages/VenueQrPage';
import RegisterPage from '../pages/RegisterPage';
import RootLayout from '../layouts/RootLayout';
import LogoutPage from '../pages/LogoutPage';
// import {NotFound} from '../auth/pages/NotFound';
import DashboardPage from '../pages/Dashboard';
import ScanPage from '../pages/ScanPage';
import {DebugError} from '../pages/DebugError';
import {Renew} from '../pages/Renew';
import ApplyVenuePage from '../pages/ApplyVenuePage';
import VenueStaticQrPage from '../pages/VenueStaticQrPage';

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
                path: '/venues/:id',
                element: (
                    <ProtectedRoute>
                        <VenueStaticQrPage />
                    </ProtectedRoute>
                ),
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
            {
                path: '/venues/apply',
                element: <ApplyVenuePage />,
            },

            // {
            //     path: '*',
            //     element: <NotFound />,
            // },
        ],
    },
]);

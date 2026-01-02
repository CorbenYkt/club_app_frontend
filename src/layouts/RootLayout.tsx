import {Outlet} from 'react-router-dom';
import TopBar from '../components/TopBar';
import {Footer} from '../components/Footer';

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopBar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

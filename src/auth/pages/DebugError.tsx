import {useRouteError, isRouteErrorResponse, Link} from 'react-router-dom';

export function DebugError() {
    const error = useRouteError();

    let title = 'Route error';
    let details: unknown = error;

    if (isRouteErrorResponse(error)) {
        title = `RouteErrorResponse: ${error.status} ${error.statusText}`;
        details = {data: error.data, status: error.status, statusText: error.statusText};
    } else if (error instanceof Error) {
        title = `Error: ${error.message}`;
        details = {message: error.message, stack: error.stack, name: error.name};
    } else if (typeof error === 'string') {
        title = `Thrown string`;
        details = error;
    } else if (error && typeof error === 'object') {
        title = `Thrown object`;
        details = error;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-black">Debug Error Page</h1>
                <p className="mt-2 text-slate-300">{title}</p>

                <pre className="mt-4 overflow-auto rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-xs text-slate-200">
                    {JSON.stringify(details, null, 2)}
                </pre>

                <div className="mt-6 flex gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-xl bg-green-500 px-4 py-2 font-bold text-slate-950 hover:bg-green-400">
                        Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 font-bold text-slate-100 hover:bg-slate-800/50">
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

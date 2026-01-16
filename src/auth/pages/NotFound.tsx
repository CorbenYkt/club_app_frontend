import {Link, useRouteError, isRouteErrorResponse} from 'react-router-dom';

export function NotFound() {
    const error = useRouteError();

    let title = 'Something went wrong';
    let message = 'Please try again later.';

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = '404 — Page not found';
            message = 'That page doesn’t exist or was moved.';
        } else {
            title = `${error.status} — ${error.statusText}`;
            message = error.data?.message ?? message;
        }
    }

    if (error instanceof Error) {
        title = 'App error';
        message = error.message;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
                    {/* Accent bar */}
                    <div className="h-1 w-full bg-green-500" />

                    <div className="p-8 text-center">
                        <div className="mono text-xs uppercase tracking-widest text-slate-500">Pulse Club</div>

                        <h1 className="mt-3 text-4xl font-black tracking-tight">
                            {title.includes('404') ? (
                                <>
                                    Page <span className="text-green-500">not found</span>
                                </>
                            ) : (
                                title
                            )}
                        </h1>

                        <p className="mt-4 text-sm text-slate-400 leading-relaxed">{message}</p>

                        <div className="mt-8 grid gap-3">
                            <Link
                                to="/"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-green-400">
                                Go home
                            </Link>

                            {/* <Link
                                to="/login"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/50">
                                Sign in
                            </Link> */}
                        </div>

                        <div className="mt-8 text-xs text-slate-500">
                            If you believe this is a mistake, contact{' '}
                            <a href="mailto:pulseclubnz@gmail.com" className="underline hover:text-slate-300">
                                pulseclubnz@gmail.com{' '}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

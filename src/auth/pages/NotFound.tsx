import {Link, useRouteError, isRouteErrorResponse} from 'react-router-dom';

export function NotFound() {
    const error = useRouteError();

    let title = 'Something went wrong';
    let message = 'Please try again.';

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = '404 — Page not found';
            message = "That page doesn't exist.";
        } else {
            title = `${error.status} — ${error.statusText}`;
            message = error.data?.message ?? message;
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-3 text-gray-600">{message}</p>

            <div className="mt-6">
                <Link
                    to="/"
                    className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                    Go home
                </Link>
            </div>
        </div>
    );
}

import {apiGet, apiPost} from '../auth/appApi';

export type Venue = {
    id: string;
    name: string;
    city: string | null;
    address: string | null;
    discountText: string;
    isActive: boolean;
};

export async function fetchVenues(params?: {q?: string; active?: boolean}) {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.active !== undefined) sp.set('active', String(params.active));

    const qs = sp.toString();
    return apiGet<{data: Venue[]}>(`/venues${qs ? `?${qs}` : ''}`);
}
export type ApplyVenueBody = {
    name: string;
    city?: string;
    address?: string;
    discountText: string;
};

export type ApplyVenueResponse = {ok: true};

export async function applyVenue(body: ApplyVenueBody) {
    return apiPost<ApplyVenueResponse>('/venues/apply', body);
}

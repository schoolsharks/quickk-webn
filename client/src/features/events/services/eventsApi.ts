import { api } from '../../../app/api';

export const eventsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getActiveEvents: builder.query({
            query: () => ({
                url: '/user/getActiveEvents',
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data.events[0],
        }),

        getUpcomingEvents: builder.query({
            query: () => ({
                url: '/user/getUpcomingEvents',
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data.events,
        }),

        getPastEvents: builder.query({
            query: () => ({
                url: '/user/getPastEvents',
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data.events,
        }),

        getEventById: builder.query({
            query: (eventId) => ({
                url: `/user/getEventById/${eventId}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data,
        }),

    }),
});

export const {
    useGetActiveEventsQuery,
    useGetUpcomingEventsQuery,
    useGetPastEventsQuery,
    useGetEventByIdQuery,
} = eventsApi;
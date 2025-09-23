import { api } from "../../../app/api";

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveEvents: builder.query({
      query: ({ type }: { type: "active" | "miscellaneous" | "upcoming" }) => ({
        url: "/user/getActiveEvents",
        method: "GET",
        params: { type },
      }),
      transformResponse: (response: any) => response?.data.events[0],
    }),

    getUpcomingEvents: builder.query({
      query: () => ({
        url: "/user/getUpcomingEvents",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data.events,
    }),

    getPastEvents: builder.query({
      query: () => ({
        url: "/user/getPastEvents",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data.events,
    }),

    getEventById: builder.query({
      query: (eventId) => ({
        url: `/user/getEventById/${eventId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    // Admin endpoints
    getAdminEventStats: builder.query({
      query: () => ({
        url: "/admin/getAdminEventStats",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getAllEventsAdmin: builder.query({
      query: (params: {
        page?: number;
        limit?: number;
        status?: string;
        city?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      } = {}) => ({
        url: "/admin/getAllEventsAdmin",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response?.data,
    }),

    searchEventsAdmin: builder.query({
      query: (params: {
        q?: string;
        startDate?: string;
        city?: string;
        status?: string;
        page?: number;
        limit?: number;
      }) => ({
        url: "/admin/searchEventsAdmin",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response?.data,
    }),

    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "/admin/createEvent",
        method: "POST",
        body: eventData,
      }),
      transformResponse: (response: any) => response?.data,
    }),

    updateEvent: builder.mutation({
      query: ({ eventId, eventData }) => {
        if (eventData instanceof FormData) {
          return {
            url: `/admin/updateEvent/${eventId}`,
            method: 'PUT',
            body: eventData,
          };
        }
        return {
          url: `/admin/updateEvent/${eventId}`,
          method: 'POST',
          body: { eventData },
        };
      },
      invalidatesTags: ['AdminEvents'],
    }),

    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/admin/deleteEvent/${eventId}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    cloneEvent: builder.mutation({
      query: (eventId) => ({
        url: `/admin/cloneEvent/${eventId}`,
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    createBlankEvent: builder.mutation({
      query: () => ({
        url: '/admin/createBlankEvent',
        method: 'POST',
      }),
      invalidatesTags: ['AdminEvents'],
    }),

    getEvent: builder.query({
      query: (eventId) => ({
        url: `/admin/getEvent/${eventId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, eventId) => [
        { type: 'AdminEvents', id: eventId }
      ],
    }),

    improveEventDescription: builder.mutation({
      query: (data: {
        originalDescription: string;
        eventTitle: string;
        eventType: 'ONLINE' | 'OFFLINE';
      }) => ({
        url: '/admin/improveEventDescription',
        method: 'POST',
        body: data,
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
  // Admin hooks
  useGetAdminEventStatsQuery,
  useGetAllEventsAdminQuery,
  useSearchEventsAdminQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCloneEventMutation,
  useCreateBlankEventMutation,
  useGetEventQuery,
  useImproveEventDescriptionMutation,
} = eventsApi;

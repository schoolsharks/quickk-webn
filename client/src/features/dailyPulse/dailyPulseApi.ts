import { api } from '../../app/api';

export const dailyPulseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDailyPulse: builder.query({
            query: () => ({
                url: '/user/getDailyPulse',
                method: 'GET',
            }),
            providesTags: ['DailyPulse'],
        }),

        submitPulseResponse: builder.mutation({
            query: (response) => ({
                url: '/user/submitPulseResponse',
                method: 'POST',
                body: response,
            }),
            // invalidatesTags: ['DailyPulse'],
        }),

        getDailyPulseTable: builder.query({
            query: () => ({
                url: '/admin/getDailyPulseTable',
                method: "GET",
            }),
            providesTags: ['DailyPulseAdmin'],
        }),

        updateDailyPulse: builder.mutation({
            query: (response) => ({
                url: '/admin/updateDailyPulse',
                method: 'POST',
                body: response,
            }),
            invalidatesTags: ['DailyPulseAdmin']
        }),

        createBlankDailyPulse: builder.mutation({
            query: (response) => ({
                url: '/admin/createBlankDailyPulse',
                method: 'POST',
                body: response,
            }),
            invalidatesTags: ['DailyPulseAdmin']
        }),

        getDailyPulseById: builder.query({
            query: (dailyPulseId) => ({
                url: `/admin/getDailyPulseById/${dailyPulseId}`,
                method: "GET",
            }),
        }),

        deleteDailyPulseById: builder.mutation({
            query: (dailyPulseId) => ({
                url: '/admin/deleteDailyPulseById',
                method: 'DELETE',
                body: { dailyPulseId },
            }),
            invalidatesTags: ['DailyPulseAdmin'],
        }),

        archievedailyPulseById: builder.mutation({
            query: (dailyPulseId) => ({
                url: `/admin/archievedailyPulseById/${dailyPulseId}`,
                method: 'PUT',
            }),
            invalidatesTags: ['DailyPulseAdmin'],
        }),

        cloneDailyPulseById: builder.mutation({
            query: (dailyPulseId) => ({
                url: `/admin/cloneDailyPulseById/${dailyPulseId}`,
                method: 'POST',
            }),
            invalidatesTags: ['DailyPulseAdmin'],
        }),

        createAIDailyPulse: builder.mutation({
            query: (dailyPulseData) => ({
                url: '/admin/createAIDailyPulse',
                method: 'POST',
                body: dailyPulseData,
            }),
            invalidatesTags: ['DailyPulseAdmin'],
        }),

        getDailyPulseStats: builder.query({
            query: () => ({
                url: '/admin/getDailyPulseStats',
                method: 'GET',
            }),
            providesTags: ['DailyPulseAdmin'],
        }),
        searchDailyPulse: builder.query({
            query: (params) => ({
                url: "/admin/search/dailyPulse",
                method: 'GET',
                params
            }),
        }),
        getTodayDailyPulseEngagement: builder.query({
            query: () => ({
                url: "/admin/getTodayDailyPulseEngagement",
                method: 'GET',
            }),
        }),



    }),
});

export const {
    useGetDailyPulseQuery,
    useLazyGetDailyPulseQuery,
    useSubmitPulseResponseMutation,
    useGetDailyPulseTableQuery,
    useLazyGetDailyPulseTableQuery,
    useUpdateDailyPulseMutation,
    useCreateBlankDailyPulseMutation,
    useGetDailyPulseByIdQuery,
    useDeleteDailyPulseByIdMutation,
    useCreateAIDailyPulseMutation,
    useGetDailyPulseStatsQuery,
    useArchievedailyPulseByIdMutation,
    useCloneDailyPulseByIdMutation,
    useSearchDailyPulseQuery,
    useGetTodayDailyPulseEngagementQuery
} = dailyPulseApi;
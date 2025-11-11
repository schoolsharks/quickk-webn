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

        downloadDailyPulseReport: builder.mutation({
            query: (dailyPulseId) => ({
                url: `/admin/downloadDailyPulseReport/${dailyPulseId}`,
                method: 'GET',
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let filename = 'DailyPulse_Report.xlsx';
                    
                    if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                        if (filenameMatch) {
                            filename = filenameMatch[1];
                        }
                    }
                    
                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    return { success: true, filename };
                },
            }),
        }),

        // Connection Feedback endpoints
        getConnectionFeedbackPulse: builder.query({
            query: () => ({
                url: '/user/connection-feedback/getConnectionFeedbackPulse',
                method: 'GET',
            }),
            providesTags: ['DailyPulse'],
        }),

        submitConnectionFeedbackResponse: builder.mutation({
            query: (response) => ({
                url: '/user/connection-feedback/submitConnectionFeedbackResponse',
                method: 'POST',
                body: response,
            }),
            invalidatesTags: ['DailyPulse'],
        }),

        getConnectionFeedbacks: builder.query({
            query: (params) => ({
                url: '/user/connection-feedback/getConnectionFeedbacks',
                method: 'GET',
                params,
            }),
            providesTags: ['DailyPulse'],
        }),

        // Resource Rating Endpoints
        getResourceRatingPulse: builder.query({
            query: () => ({
                url: '/user/getResourceRatingPulse',
                method: 'GET',
            }),
            providesTags: ['DailyPulse'],
        }),

        submitResourceRatingResponse: builder.mutation({
            query: (response) => ({
                url: '/user/resource-rating/submit',
                method: 'POST',
                body: response,
            }),
            invalidatesTags: ['DailyPulse'],
        }),

        getUserResourceRatings: builder.query({
            query: (params) => ({
                url: '/user/resource-rating/history',
                method: 'GET',
                params,
            }),
            providesTags: ['DailyPulse'],
        }),

        getResourceRatingStats: builder.query({
            query: (resourceId) => ({
                url: `/user/resource-rating/stats/${resourceId}`,
                method: 'GET',
            }),
            providesTags: ['DailyPulse'],
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
    useGetTodayDailyPulseEngagementQuery,
    useDownloadDailyPulseReportMutation,
    // Connection Feedback hooks
    useGetConnectionFeedbackPulseQuery,
    useLazyGetConnectionFeedbackPulseQuery,
    useSubmitConnectionFeedbackResponseMutation,
    useGetConnectionFeedbacksQuery,
    // Resource Rating hooks
    useGetResourceRatingPulseQuery,
    useLazyGetResourceRatingPulseQuery,
    useSubmitResourceRatingResponseMutation,
    useGetUserResourceRatingsQuery,
    useGetResourceRatingStatsQuery
} = dailyPulseApi;
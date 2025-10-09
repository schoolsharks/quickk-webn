import { api } from '../../../app/api';
import { Roles, setAuth } from '../../auth/authSlice';


export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        loginAdmin: builder.mutation({
            query: (credentials) => ({
                url: '/admin/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setAuth({ loading: true }));
                try {
                    await queryFulfilled;
                    // Role will be set when fetchAdmin is called after login
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: Roles.ADMIN, // Default to ADMIN, will be updated by fetchAdmin
                        loading: false
                    }));
                } catch (error: any) {
                    dispatch(setAuth({ loading: false }));
                }
            },
            invalidatesTags: ['Auth'],
        }),

        fetchAdmin: builder.query({
            query: () => ({
                url: '/admin/fetchAdmin',
                method: 'GET',
            }),
            providesTags: ["Admin"],
            transformResponse: (response: any) => response,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setAuth({ loading: true }));
                try {
                    const { data } = await queryFulfilled;
                    // Map backend role to frontend role enum
                    const adminRole = data?.data?.admin?.role === 'super-admin' ? Roles.SUPER_ADMIN : Roles.ADMIN;
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: adminRole,
                        loading: false
                    }));
                } catch (error: any) {
                    dispatch(setAuth({ loading: false }));
                }
            }

        }),

        verifyAdminOtp: builder.mutation({
            query: (data) => ({
                url: '/admin/verifyAdminOtp',
                method: 'POST',
                body: data,
            }),
        }),
        resendAdminOtp: builder.mutation({
            query: (data) => ({
                url: '/admin/resendAdminOtp',
                method: 'POST',
                body: data,
            }),
        }),

        logoutAdmin: builder.mutation({
            query: () => ({
                url: '/admin/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setAuth({ loading: true }));
                try {
                    await queryFulfilled;
                    dispatch(setAuth({
                        isAuthenticated: false,
                        role: null,
                        loading: false
                    }));
                } catch (error: any) {
                    dispatch(setAuth({ loading: false }));
                }
            },
            invalidatesTags: ['Auth', 'Admin'],
        }),

        checkAdminEmailExists: builder.mutation({
            query: (data: { adminEmail: string }) => ({
                url: '/admin/checkAdminEmailExists',
                method: 'POST',
                body: data,
            }),
        }),

        getAllUsersTableData: builder.query({
            query: (webnClubMember) => ({
                url: '/admin/getAllUsersTableData',
                method: 'GET',
                params: { webnClubMember },
            }),
            providesTags: ['AdminUser'],
        }),

        addEditUser: builder.mutation({
            query: (data) => {
                // If data is FormData (file upload), send as is
                if (data instanceof FormData) {
                    return {
                        url: '/admin/addEditUser',
                        method: 'POST',
                        body: data,
                    };
                }
                // Otherwise, send as regular JSON
                return {
                    url: '/admin/addEditUser',
                    method: 'POST',
                    body: { userDetails: data },
                };
            },
            invalidatesTags: ["AdminUser"],
        }),

        bulkUploadUsers: builder.mutation({
            query: (users) => ({
                url: '/admin/bulkUploadUsers',
                method: 'POST',
                body: { users },
            }),
            invalidatesTags: ["AdminUser"],
        }),

        createBlankUser: builder.mutation({
            query: () => ({
                url: '/admin/createBlankUser',
                method: 'POST',
            }),
            invalidatesTags: ['AdminUser'],
        }),

        getUserById: builder.query({
            query: (userId) => ({
                url: `/admin/getUserById/${userId}`,
                method: 'GET',
            }),
        }),

        deleteUserById: builder.mutation({
            query: (userId) => ({
                url: `/admin/deleteUserById/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminUser'],
        }),

        moveUserToWebn: builder.mutation({
            query: (userId) => ({
                url: `/admin/moveUserToWebn${userId}`,
                method: 'PUT',
            }),
            invalidatesTags: ['AdminUser'],
        }),

        searchUsers: builder.query({
            query: (params) => ({
                url: "/admin/search/users",
                method: 'GET',
                params
            }),
        }),

        getActiveUsersStats: builder.query({
            query: () => ({
                url: '/admin/getActiveUsersStats',
                method: 'GET',
            }),
        }),

        getDashboardStats: builder.query({
            query: () => ({
                url: '/admin/getDashboardStats',
                method: 'GET',
            }),
            providesTags: ['Admin'],
        }),

        getEngagementAnalytics: builder.query({
            query: () => ({
                url: '/admin/getEngagementAnalytics',
                method: 'GET',
            }),
            providesTags: ['Admin'],
        }),

        getParticipationLeaderboard: builder.query({
            query: () => ({
                url: '/admin/getParticipationLeaderboard',
                method: 'GET',
            }),
            providesTags: ['Admin'],
        }),

        searchAddresses: builder.query({
            query: (param) => ({
                url: '/admin/searchAddresses',
                method: 'GET',
                params: param
            }),
        }),

        // Connection Analytics endpoints
        getConnectionStats: builder.query({
            query: (params: { period?: string } = {}) => ({
                url: '/admin/getConnectionStats',
                method: 'GET',
                params,
            }),
            providesTags: ['Admin'],
            transformResponse: (response: any) => response?.data,
        }),

        exportConnections: builder.query({
            query: (params: { 
                limit?: number;
                period?: string; 
            } = {}) => ({
                url: '/admin/exportConnections',
                method: 'GET',
                params,
                responseHandler: (response) => response.blob(),
            }),
        }),

    }),
});

export const {
    useLoginAdminMutation,
    useFetchAdminQuery,
    useLazyFetchAdminQuery,
    useLogoutAdminMutation,
    useVerifyAdminOtpMutation,
    useResendAdminOtpMutation,
    useCheckAdminEmailExistsMutation,
    useGetAllUsersTableDataQuery,
    useAddEditUserMutation,
    useBulkUploadUsersMutation,
    useGetUserByIdQuery,
    useCreateBlankUserMutation,
    useDeleteUserByIdMutation,
    useMoveUserToWebnMutation,
    useSearchUsersQuery,
    useGetActiveUsersStatsQuery,
    useGetDashboardStatsQuery,
    useGetEngagementAnalyticsQuery,
    useGetParticipationLeaderboardQuery,
    useLazySearchAddressesQuery,
    // Connection analytics hooks
    useGetConnectionStatsQuery,
    useLazyExportConnectionsQuery,
} = adminApi;
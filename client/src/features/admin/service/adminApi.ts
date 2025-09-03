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
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: Roles.ADMIN,
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
            transformResponse: (response) => response,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setAuth({ loading: true }));
                try {
                    await queryFulfilled;
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: Roles.ADMIN,
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
            query: () => ({
                url: '/admin/getAllUsersTableData',
                method: 'GET',
            }),
            providesTags: ['AdminUser'],
        }),

        addEditUser: builder.mutation({
            query: (data) => ({
                url: '/admin/addEditUser',
                method: 'POST',
                body: { userDetails: data },
            }),
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
    useSearchUsersQuery,
    useGetActiveUsersStatsQuery
} = adminApi;
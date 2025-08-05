import { api } from '../../app/api';
import { Roles, setAuth } from '../auth/authSlice';

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: Roles.USER,
                    }));
                } catch (error) {
                    console.error('Error Login user:', error);
                }
            },
            invalidatesTags: ['Auth'],
        }),

        fetchUser: builder.query({
            query: () => ({
                url: '/user/fetchUser',
                method: 'GET',
            }),
            providesTags:["Learning","DailyPulse","Tickets"],
            transformResponse: (response) => {
                return response;
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setAuth({
                        isAuthenticated: true,
                        role: Roles.USER,
                    }));
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
                finally {
                    dispatch(setAuth({
                        loading: false,
                    }));
                }
            },
        }),


        getLeaderboard: builder.query({
            query: () => ({
                url: '/user/getLeaderboard',
                method: 'GET',
            }),
            providesTags:["Learning","DailyPulse","Tickets"]
        }),

        getAllAvatars: builder.query({
            query: () => ({
                url: '/user/getAllAvatars',
                method: 'GET',
            }),
        }),
        
        selectAvatar: builder.mutation({
            query: (avatarId) => ({
                url: `/user/selectAvatar`,
                method: 'POST',
                body: avatarId,
            }),
        }),

        





    }),
});

export const {
    useLoginUserMutation,
    useFetchUserQuery,
    useLazyFetchUserQuery,
    useGetLeaderboardQuery,
    useGetAllAvatarsQuery,
    useSelectAvatarMutation,
} = usersApi;

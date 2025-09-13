import { api } from "../../app/api";
import { Roles, setAuth } from "../auth/authSlice";
import { SignupData } from "../auth/components/SignupScreen";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            setAuth({
              isAuthenticated: true,
              role: Roles.USER,
            })
          );
        } catch (error) {
          console.error("Error Login user:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    sendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/user/sendOtp",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    resendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/user/resendOtp",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "/user/verifyOtp",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            setAuth({
              isAuthenticated: true,
              role: Roles.USER,
            })
          );
        } catch (error) {
          console.error("Error verifying OTP:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    signupUser: builder.mutation({
      query: ({
        signupData,
        ref,
      }: {
        signupData: SignupData;
        ref?: string | null;
      }) => ({
        url: "/user/signup",
        method: "POST",
        body: { ...signupData, ref },
      }),
    }),

    fetchUser: builder.query({
      query: () => ({
        url: "/user/fetchUser",
        method: "GET",
      }),
      providesTags: ["Learning", "DailyPulse", "Tickets", "User"],
      transformResponse: (response) => {
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            setAuth({
              isAuthenticated: true,
              role: Roles.USER,
            })
          );
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          dispatch(
            setAuth({
              loading: false,
            })
          );
        }
      },
    }),

    getLeaderboard: builder.query({
      query: () => ({
        url: "/user/getLeaderboard",
        method: "GET",
      }),
      providesTags: ["Learning", "DailyPulse", "Tickets"],
    }),

    getAllAvatars: builder.query({
      query: () => ({
        url: "/user/getAllAvatars",
        method: "GET",
      }),
    }),

    selectAvatar: builder.mutation({
      query: (avatarId) => ({
        url: `/user/selectAvatar`,
        method: "POST",
        body: avatarId,
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `/user/updateUserProfile`,
        method: "POST",
        body: { userDetails: data },
      }),
      invalidatesTags: ["User"],
    }),

    searchNetworkUsers: builder.query({
      query: (params) => ({
        url: "/user/search/users",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    getUserRecommendations: builder.query({
      query: (params) => ({
        url: "/user/getRecommendations",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSendOtpMutation,
  useLogoutMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useSignupUserMutation,
  useFetchUserQuery,
  useLazyFetchUserQuery,
  useGetLeaderboardQuery,
  useGetAllAvatarsQuery,
  useSelectAvatarMutation,
  useUpdateUserProfileMutation,
  useSearchNetworkUsersQuery,
  useLazySearchNetworkUsersQuery,
  useGetUserRecommendationsQuery,
  useLazyGetUserRecommendationsQuery,
} = usersApi;

import { api } from '../../app/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    getCurrentUser: builder.query<void, void>({
      query: () => '/user/fetchUser',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery
} = authApi;
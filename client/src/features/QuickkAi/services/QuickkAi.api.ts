import { api } from '../../../app/api';

export const QuickkAiApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getChatById: builder.query({
            query: (chatId) => ({
                url: `/admin/chat/${chatId}`,
                method: 'GET',
            }),
            providesTags: ['QuickkAi'],
        }),
        getChatsByAdmin: builder.query({
            query: ({ page = 1, limit = 20 }) => ({
                url: `/admin/chat`,
                method: 'GET',
                params: { page, limit },
            }),
            providesTags: ['QuickkAi'],
        }),
        updateChatOnCompletion: builder.mutation({
            query: ({ chatId, body }) => ({
                url: `/admin/chat/${chatId}/completion`,
                method: 'PUT',
                body : body,
            }),
            invalidatesTags: ['QuickkAi'],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/admin/chat/deleteChatById/${chatId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['QuickkAi'],
        }),
        searchChats: builder.mutation({
            query: ({ q }) => ({
                url: `/admin/chat/search`,
                method: 'GET',
                params: { q }, // Send query param like ?q=searchText
            }),
            // providesTags: [],
        }),
        createNewChat: builder.mutation({
            query: () => ({
                url: `/admin/chat/createNewChat`,
                method: 'POST',
            }),
            invalidatesTags: ['QuickkAi'],
        }),


    }),
});

export const {
    useGetChatByIdQuery,
    useGetChatsByAdminQuery,
    useUpdateChatOnCompletionMutation,
    useDeleteChatMutation,
    useSearchChatsMutation,
    useCreateNewChatMutation,
} = QuickkAiApi;
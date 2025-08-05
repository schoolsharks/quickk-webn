import { api } from "../../../app/api";

// Define the return type for better type safety
interface PurchaseResponse {
    success: boolean;
    message: string;
    tickets: {
        _id: string;
        status: string;
        reward: string;
        user: string;
        ticketCode: string;
        tokenNumber: number;
    }[];
}

export const bidingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllRewards: builder.query({
            query: () => ({
                url: '/user/getAllRewards',
                method: 'GET',
            }),
        }),
        getUserTickets: builder.query({
            query: () => ({
                url: '/user/getUserTickets',
                method: 'GET',
            }),
        }),
        buyTicket: builder.mutation<PurchaseResponse, { rewardId: string, quantity: number }>({
            query: ({ rewardId, quantity }) => ({
                url: '/user/buyTicket',
                method: 'POST',
                body: { rewardId, quantity },
            }),
            invalidatesTags: ['Tickets'],
        }),
        getLiveReward: builder.query({
            query: (rewardId: string) => ({
                url: `/user/getLiveReward/${rewardId}`,
                method: 'GET',
            }),
        }),
        getUpcomingReward: builder.query({
            query: () => ({
                url: '/user/getUpcomingReward',
                method: 'GET',
            }),
        }),

        getWinnerTicket: builder.query({
            query: ({rewardId}) => ({
                url: `/user/getWinnerTicket/${rewardId}`,
                method: 'GET',
            }),
        }),

        getLastPastReward: builder.query({
            query: () => ({
                url: '/user/getLastPastReward',
                method: 'GET',
            }),
        }),

    }),
});

export const {
    useGetAllRewardsQuery,
    useGetUserTicketsQuery,
    useBuyTicketMutation,
    useGetLiveRewardQuery,
    useGetUpcomingRewardQuery,
    useGetWinnerTicketQuery,
    useGetLastPastRewardQuery
} = bidingApi;
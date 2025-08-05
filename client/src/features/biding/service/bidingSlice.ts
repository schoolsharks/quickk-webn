import { createSlice } from '@reduxjs/toolkit';
import { SerializedError } from '@reduxjs/toolkit';
import { bidingApi } from './bidingApi';

// Update the Ticket interface to match what's coming from your API
interface Ticket {
    tokenNumber: number;
    ticketCode: string;
    status: string;
    rewardImage?: string;
    id?: string;
    reward?: string;
    user?: string;
}

interface LiveReward {
    startTime: Date;
    endTime: Date;
    price: number;
    status: string;
    name: string;
    description?: string;
    image?: string;
    participantCount: number;
}

interface UpcomingReward {
    startTime: Date;
    estimatedValue: number;
    name: string;
    description: string;
    image: string;
}

// Update the interface for the purchase response
interface PurchaseResponse {
    success: boolean;
    message: string;
    tickets: Ticket[];
}

const initialState = {
    rewards: null,
    isLoading: false,
    error: null as SerializedError | null,
    tickets: null as Ticket | null,
    liveReward: null as LiveReward | null,
    upcomingReward: null as UpcomingReward | null,
    purchasedTickets: [] as Ticket[], // New state for purchased tickets
    lastPurchaseSuccess: false, // To track if the last purchase was successful
};

const bidingSlice = createSlice({
    name: 'biding',
    initialState,
    reducers: {
        // Add a reducer to clear purchased tickets (useful when leaving the confirmation page)
        clearPurchasedTickets: (state) => {
            state.purchasedTickets = [];
            state.lastPurchaseSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                bidingApi.endpoints.getAllRewards.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getAllRewards.matchFulfilled,
                (state, { payload }) => {
                    state.rewards = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getAllRewards.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                bidingApi.endpoints.getUserTickets.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getUserTickets.matchFulfilled,
                (state, { payload }) => {
                    state.tickets = payload as Ticket;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getUserTickets.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        // Handle buyTicket mutation - Updated to store purchased tickets
        builder
            .addMatcher(
                bidingApi.endpoints.buyTicket.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.lastPurchaseSuccess = false;
                }
            )
            .addMatcher(
                bidingApi.endpoints.buyTicket.matchFulfilled,
                (state, { payload }) => {
                    state.isLoading = false;
                    // Store the purchased tickets in the state
                    const response = payload as PurchaseResponse;
                    state.purchasedTickets = response.tickets;
                    state.lastPurchaseSuccess = true;
                }
            )
            .addMatcher(
                bidingApi.endpoints.buyTicket.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                    state.lastPurchaseSuccess = false;
                }
            );

        // Handle getLiveReward query
        builder
            .addMatcher(
                bidingApi.endpoints.getLiveReward.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getLiveReward.matchFulfilled,
                (state, { payload }) => {
                    state.liveReward = payload as LiveReward;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getLiveReward.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                bidingApi.endpoints.getUpcomingReward.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getUpcomingReward.matchFulfilled,
                (state, { payload }) => {
                    state.upcomingReward = payload as UpcomingReward;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                bidingApi.endpoints.getUpcomingReward.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


            builder
                .addMatcher(
                    bidingApi.endpoints.getWinnerTicket.matchPending,
                    (state) => {
                        state.isLoading = true;
                        state.error = null;
                    }
                )
                .addMatcher(
                    bidingApi.endpoints.getWinnerTicket.matchFulfilled,
                    (state) => {
                        state.isLoading = false;
                    }
                )
                .addMatcher(
                    bidingApi.endpoints.getWinnerTicket.matchRejected,
                    (state, { error }) => {
                        state.isLoading = false;
                        state.error = error;
                    }
                );

                builder
                    .addMatcher(
                        bidingApi.endpoints.getLastPastReward.matchPending,
                        (state) => {
                            state.isLoading = true;
                            state.error = null;
                        }
                    )
                    .addMatcher(
                        bidingApi.endpoints.getLastPastReward.matchFulfilled,
                        (state) => {
                            state.isLoading = false;
                        }
                    )
                    .addMatcher(
                        bidingApi.endpoints.getLastPastReward.matchRejected,
                        (state, { error }) => {
                            state.isLoading = false;
                            state.error = error;
                        }
                    );
    },
});

export const { clearPurchasedTickets } = bidingSlice.actions;
export default bidingSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { dailyPulseApi } from './dailyPulseApi';
import { SerializedError } from '@reduxjs/toolkit';

const initialState = {
    dailyPulse: null,
    isLoading: false,
    error: null as SerializedError | null,
};

const dailyPulseSlice = createSlice({
    name: 'dailyPulse',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulse.matchFulfilled,
                (state, { payload }) => {
                    state.dailyPulse = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.submitPulseResponse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.submitPulseResponse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.submitPulseResponse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseTable.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseTable.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseTable.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.updateDailyPulse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.updateDailyPulse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.updateDailyPulse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                dailyPulseApi.endpoints.createBlankDailyPulse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.createBlankDailyPulse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.createBlankDailyPulse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                dailyPulseApi.endpoints.deleteDailyPulseById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.deleteDailyPulseById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.deleteDailyPulseById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.archievedailyPulseById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.archievedailyPulseById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.archievedailyPulseById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.createAIDailyPulse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.createAIDailyPulse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.createAIDailyPulse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseStats.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseStats.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getDailyPulseStats.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                dailyPulseApi.endpoints.searchDailyPulse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.searchDailyPulse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.searchDailyPulse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                dailyPulseApi.endpoints.getTodayDailyPulseEngagement.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getTodayDailyPulseEngagement.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                dailyPulseApi.endpoints.getTodayDailyPulseEngagement.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );







    },
});

export default dailyPulseSlice.reducer;
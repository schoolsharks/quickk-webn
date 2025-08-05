import { createSlice } from '@reduxjs/toolkit';
import { QuickkAiApi } from './QuickkAi.api';
import { SerializedError } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error: null as SerializedError | null,
};

const quickkAiSlice = createSlice({
    name: 'quickkAi',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                QuickkAiApi.endpoints.getChatById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.getChatById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.getChatById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                QuickkAiApi.endpoints.getChatsByAdmin.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.getChatsByAdmin.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.getChatsByAdmin.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                QuickkAiApi.endpoints.updateChatOnCompletion.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.updateChatOnCompletion.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.updateChatOnCompletion.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                QuickkAiApi.endpoints.deleteChat.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.deleteChat.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.deleteChat.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                QuickkAiApi.endpoints.searchChats.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.searchChats.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.searchChats.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                QuickkAiApi.endpoints.createNewChat.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.createNewChat.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                QuickkAiApi.endpoints.createNewChat.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

    },
});

export default quickkAiSlice.reducer;
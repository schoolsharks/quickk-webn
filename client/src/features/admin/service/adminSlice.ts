import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { adminApi } from './adminApi';

interface AdminState {
    loading: boolean;
    error: string | null | SerializedError;
}

const initialState: AdminState = {
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        resetAdminState(state) {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                adminApi.endpoints.getAllUsersTableData.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.getAllUsersTableData.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.getAllUsersTableData.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                adminApi.endpoints.addEditUser.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.addEditUser.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.addEditUser.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                adminApi.endpoints.createBlankUser.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.createBlankUser.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.createBlankUser.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                adminApi.endpoints.deleteUserById.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.deleteUserById.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.deleteUserById.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                adminApi.endpoints.searchUsers.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.searchUsers.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.searchUsers.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                adminApi.endpoints.getActiveUsersStats.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                adminApi.endpoints.getActiveUsersStats.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                adminApi.endpoints.getActiveUsersStats.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error;
                }
            );

    }
});

export const { setLoading, setError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
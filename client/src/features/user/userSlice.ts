import { createSlice } from '@reduxjs/toolkit';
import { usersApi } from './userApi';
import { SerializedError } from '@reduxjs/toolkit';

interface UserState {
    companyMail: string | null;
    name: string | null;
    userId: string | null;
    totalStars: number;
    redeemedStars: number;
    address: string | null;
    contact: string | null;
    rank: number | null;
    avatarSelected: boolean;
    learningStreak: number | null;
    progress: number | null;
    eventMode: boolean;
    // New profile completion fields
    businessCategory: string | null;
    designation: string | null;
    currentStage: string | null;
    communityGoal: string | null;
    interestedEvents: string | null;
    businessLogo: string | null;
    webnClubMember: boolean | null;
    users: Array<{
        name: string;
        totalStars: number;
        time: string;
        avatar?: string;
    }> | null;
    chapter: string | null;
    instagram: string | null;
    facebook: string | null;
    currentMonth: string | null;
    currentYear: number | null;
    isLoading: boolean;
    error: SerializedError | null;
}

interface Leaderboard {
    users: Array<{
        name: string;
        totalStars: number;
        time: string;
        avatar?: string;
    }>;
    currentMonth: string;
    currentYear: number;
}

const initialState: UserState = {
    companyMail: null,
    name: null,
    userId: null,
    totalStars: 0,
    redeemedStars: 0,
    rank: null,
    avatarSelected: false,
    learningStreak: 0,
    progress: 0,
    address: null,
    contact: null,
    // New profile completion fields
    businessCategory: null,
    designation: null,
    currentStage: null,
    communityGoal: null,
    interestedEvents: null,
    businessLogo: null,
    webnClubMember: null,
    chapter: null,
    instagram: null,
    facebook: null,
    eventMode: JSON.parse(localStorage.getItem('eventMode') || 'false'),
    users: null,
    currentMonth: null,
    currentYear: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleEventMode: (state) => {
            state.eventMode = !state.eventMode;
            localStorage.setItem('eventMode', JSON.stringify(state.eventMode));
        },
        setEventMode: (state, action) => {
            state.eventMode = action.payload;
            localStorage.setItem('eventMode', JSON.stringify(state.eventMode));
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                usersApi.endpoints.fetchUser.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.fetchUser.matchFulfilled,
                (state, { payload }) => {
                    const user = payload as {
                        data: {
                            name: string;
                            companyMail: string;
                            _id: string;
                            totalStars: number;
                            redeemedStars: number;
                            address: string;
                            contact: string;
                            rank: number;
                            avatarSelected: boolean;
                            learningStreak: number;
                            progress: number;
                            businessCategory: string;
                            designation: string;
                            currentStage: string;
                            communityGoal: string;
                            interestedEvents: string;
                            businessLogo: string;
                            webnClubMember: boolean;
                            chapter: string;
                            instagram: string;
                            facebook: string;
                        }
                    };
                    state.name = user.data.name;
                    state.companyMail = user.data.companyMail;
                    state.userId = user.data._id;
                    state.totalStars = user.data.totalStars;
                    state.redeemedStars = user.data.redeemedStars;
                    state.address = user.data.address;
                    state.contact = user.data.contact;
                    state.rank = user.data.rank;
                    state.avatarSelected = user.data.avatarSelected;
                    state.learningStreak = user.data.learningStreak;
                    state.progress = user.data.progress;
                    // Store new profile completion fields
                    state.businessCategory = user.data.businessCategory || null;
                    state.designation = user.data.designation || null;
                    state.currentStage = user.data.currentStage || null;
                    state.communityGoal = user.data.communityGoal || null;
                    state.businessLogo = user.data.businessLogo || null;
                    state.interestedEvents = user.data.interestedEvents || null;
                    state.webnClubMember = user.data.webnClubMember || false;
                    state.chapter = user.data.chapter || null;
                    state.instagram = user.data.instagram || null;
                    state.facebook = user.data.facebook || null;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                usersApi.endpoints.fetchUser.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                usersApi.endpoints.getLeaderboard.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.getLeaderboard.matchFulfilled,
                (state, { payload }) => {
                    const Leaderboard = payload as Leaderboard;
                    state.users = Leaderboard.users;
                    state.currentYear = Leaderboard.currentYear;
                    state.currentMonth = Leaderboard.currentMonth;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                usersApi.endpoints.getLeaderboard.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                usersApi.endpoints.getAllAvatars.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.getAllAvatars.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.getAllAvatars.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                usersApi.endpoints.selectAvatar.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.selectAvatar.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                usersApi.endpoints.selectAvatar.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
    },
});

export const { toggleEventMode, setEventMode } = userSlice.actions;
export default userSlice.reducer;
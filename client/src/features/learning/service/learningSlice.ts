import { createSlice } from '@reduxjs/toolkit';
import { SerializedError } from '@reduxjs/toolkit';
import { LearningApi } from './learningApi';
import { ILearning, Module } from '../Types/types';
import { QuestionProps } from '../../question/Types/types';


const initialState: {
    learning: ILearning[] | null;
    module: Module | null;
    questions: QuestionProps[];
    isLoading: boolean;
    error: SerializedError | null;
    nextModuleId: string | null;
    totalStarsAwarded: number | null;
} = {
    learning: null,
    module: null,
    questions: [],
    isLoading: false,
    error: null,
    nextModuleId: null,
    totalStarsAwarded: null,
};

const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                LearningApi.endpoints.getLearning.matchPending,
                (state) => {
                    state.learning = null;
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearning.matchFulfilled,
                (state, { payload }) => {
                    state.learning = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearning.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                    state.learning = null;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.getModule.matchPending,
                (state) => {
                    state.module = null;
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getModule.matchFulfilled,
                (state, { payload }) => {
                    state.module = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getModule.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.getAssessmentQuestions.matchPending,
                (state) => {
                    state.questions = [];
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getAssessmentQuestions.matchFulfilled,
                (state, { payload }) => {
                    state.questions = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getAssessmentQuestions.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.submitLearningResponse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.submitLearningResponse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.submitLearningResponse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );
        builder
            .addMatcher(
                LearningApi.endpoints.checkQuestionResponse.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.checkQuestionResponse.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.checkQuestionResponse.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.getModuleComplete.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getModuleComplete.matchFulfilled,
                (state, { payload }) => {
                    state.nextModuleId = payload.nextModuleId;
                    state.totalStarsAwarded = payload.totalStarsAwarded;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getModuleComplete.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.markModuleCompleted.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.markModuleCompleted.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.markModuleCompleted.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.getMissionMillion.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getMissionMillion.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getMissionMillion.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.markVideoCompleted.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.markVideoCompleted.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.markVideoCompleted.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.getLearningTableData.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningTableData.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningTableData.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.updateLearningWithModules.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.updateLearningWithModules.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.updateLearningWithModules.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.publishLearning.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.publishLearning.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.publishLearning.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.createBlankLearning.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createBlankLearning.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createBlankLearning.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.getLearningById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.getCompleteModuleById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getCompleteModuleById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getCompleteModuleById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.deleteLearningById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.deleteLearningById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.deleteLearningById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.archieveLearningById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.archieveLearningById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.archieveLearningById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.createBlankModule.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createBlankModule.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createBlankModule.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.deleteModuleById.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.deleteModuleById.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.deleteModuleById.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.createAIModule.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createAIModule.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.createAIModule.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );


        builder
            .addMatcher(
                LearningApi.endpoints.getLearningTitles.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningTitles.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.getLearningTitles.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

        builder
            .addMatcher(
                LearningApi.endpoints.searchLearning.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                LearningApi.endpoints.searchLearning.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                LearningApi.endpoints.searchLearning.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );

    },
});

export default learningSlice.reducer;
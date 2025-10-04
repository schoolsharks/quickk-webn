import { api } from "../../../app/api";

export const LearningApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLearning: builder.query({
      query: ({ language }: { language?: string } = {}) => ({
        url: "/user/getLearning",
        method: "GET",
        params: language ? { language } : undefined,
      }),
      providesTags: ["Learning"],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getModule: builder.query({
      query: (moduleId: string) => ({
        url: `/user/getModule/${moduleId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    getAssessmentQuestions: builder.query({
      query: (moduleId: string) => ({
        url: `/user/getAssessmentQuestions/${moduleId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    submitLearningResponse: builder.mutation({
      query: (response) => ({
        url: "/user/submitLearningResponse",
        method: "POST",
        body: response,
      }),
      invalidatesTags: ["Learning"],
    }),

    checkQuestionResponse: builder.mutation({
      query: (response) => ({
        url: "/user/checkQuestionResponse",
        method: "POST",
        body: response,
      }),
    }),

    getModuleComplete: builder.query({
      query: (currentModuleId: string) => ({
        url: `/user/getModuleComplete/${currentModuleId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    markModuleCompleted: builder.mutation({
      query: ({ moduleId }) => ({
        url: `/user/markModuleCompleted`,
        method: "POST",
        body: { moduleId },
      }),
      invalidatesTags: ["Learning"],
    }),

    getMissionMillion: builder.query({
      query: () => ({
        url: "/user/getMissionMillion",
        method: "GET",
      }),
    }),

    markVideoCompleted: builder.mutation({
      query: (videoId) => ({
        url: "/user/markVideoCompleted",
        method: "POST",
        body: { videoId },
      }),
    }),

    //admin api
    getLearningTableData: builder.query({
      query: () => ({
        url: "/admin/getLearningTableData",
        method: "GET",
      }),
      providesTags: ["LearningAdmin"],
    }),

    updateLearningWithModules: builder.mutation({
      query: (learningData) => ({
        url: "/admin/updateLearningWithModules",
        method: "POST",
        body: learningData,
      }),
      invalidatesTags: ["LearningAdmin"],
    }),
    updateModule: builder.mutation({
      query: (ModuleData) => ({
        url: "/admin/updateModule",
        method: "POST",
        body: ModuleData,
      }),
    }),

    publishLearning: builder.query({
      query: (learningId) => ({
        url: `/admin/publishLearning/${learningId}`,
        method: "GET",
      }),
      providesTags: ["LearningAdmin"],
    }),

    createBlankLearning: builder.query({
      query: () => ({
        url: `/admin/createBlankLearning`,
        method: "GET",
      }),
      providesTags: ["LearningAdmin"],
    }),

    getLearningById: builder.query({
      query: (learningId) => ({
        url: `/admin/getLearningById/${learningId}`,
        method: "GET",
      }),
    }),

    getCompleteModuleById: builder.query({
      query: (moduleId) => ({
        url: `/admin/getCompleteModuleById/${moduleId}`,
        method: "GET",
      }),
    }),

    deleteLearningById: builder.mutation({
      query: (learningId: string) => ({
        url: "/admin/deleteLearningById",
        method: "PUT",
        body: { learningId },
      }),
      invalidatesTags: ["LearningAdmin"],
    }),

    createBlankModule: builder.mutation({
      query: () => ({
        url: "/admin/createBlankModule",
        method: "POST",
      }),
    }),

    deleteModuleById: builder.mutation({
      query: (moduleId: string) => ({
        url: "/admin/deleteModuleById",
        method: "PUT",
        body: { moduleId },
      }),
    }),

    archieveLearningById: builder.mutation({
      query: (learningId: string) => ({
        url: `/admin/archieveLearningById/${learningId}`,
        method: "PUT",
      }),
      invalidatesTags: ["LearningAdmin"],
    }),

    createAIModule: builder.mutation({
      query: (moduleData) => ({
        url: "/admin/createAIModule",
        method: "POST",
        body: moduleData,
      }),
    }),

    getLearningStats: builder.query({
      query: () => ({
        url: "/admin/getLearningStats",
        method: "GET",
      }),
      providesTags: ["LearningAdmin"],
    }),

    getLearningTitles: builder.query({
      query: () => ({
        url: "/admin/getLearningTitles",
        method: "GET",
      }),
    }),

    searchLearning: builder.query({
      query: (params) => ({
        url: "/admin/search/learning",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        return response?.data.map((item: any) => ({
          _id: item._id,
          status: item.status,
          name: item.title,
          modules: item.modules?.length || 0,
          users: 0, // set to 0 by default
        }));
      },
    }),
  }),
});

export const {
  useGetLearningQuery,
  useGetModuleQuery,
  useGetAssessmentQuestionsQuery,
  useSubmitLearningResponseMutation,
  useCheckQuestionResponseMutation,
  useGetModuleCompleteQuery,
  useMarkModuleCompletedMutation,
  useGetMissionMillionQuery,
  useMarkVideoCompletedMutation,
  useGetLearningTableDataQuery,
  useLazyGetLearningTableDataQuery,
  useUpdateLearningWithModulesMutation,
  useUpdateModuleMutation,
  useLazyPublishLearningQuery,
  useLazyCreateBlankLearningQuery,
  useGetLearningByIdQuery,
  useLazyGetLearningByIdQuery,
  useGetCompleteModuleByIdQuery,
  useDeleteLearningByIdMutation,
  useArchieveLearningByIdMutation,
  useCreateBlankModuleMutation,
  useDeleteModuleByIdMutation,
  useCreateAIModuleMutation,
  useGetLearningStatsQuery,
  useLazyGetLearningStatsQuery,
  useGetLearningTitlesQuery,
  useSearchLearningQuery,
} = LearningApi;

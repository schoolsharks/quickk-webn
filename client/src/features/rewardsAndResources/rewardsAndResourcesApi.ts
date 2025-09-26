import { api } from "../../app/api";

export interface RewardClaimRequest {
  rewardType: string;
  advertisementBanner?: File;
  resourceId?: string;
  userInput?: string;
}

export interface RewardClaimResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    user: string;
    rewardType: string;
    advertisementBannerUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CheckRewardClaimedResponse {
  success: boolean;
  claimed: boolean;
  rewardType: string;
}

export interface ResourcesResponse {
  success: boolean;
  data: {
    _id: string;
    image: string;
    heading: string;
    subHeading: string;
    companyName: string;
    stars: number;
    description: {
      title: string;
      points: string[];
    }[];
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface SingleResourceResponse {
  success: boolean;
  data: {
    _id: string;
    image: string;
    heading: string;
    subHeading: string;
    companyName: string;
    stars: number;
    description: {
      title: string;
      points: string[];
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface CheckResourceClaimedResponse {
  success: boolean;
  claimed: boolean;
  resourceId: string;
}

export const rewardsAndResourcesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    applyForReward: builder.mutation<RewardClaimResponse, FormData | RewardClaimRequest>({
      query: (data) => {
        if (data instanceof FormData) {
          return {
            url: "/user/reward-claims/apply",
            method: "POST",
            body: data,
          };
        } else {
          return {
            url: "/user/reward-claims/apply",
            method: "POST",
            body: data,
          };
        }
      },
      invalidatesTags: ["User", "Rewards"],
    }),

    checkRewardClaimed: builder.query<CheckRewardClaimedResponse, { rewardType: string }>({
      query: ({ rewardType }) => ({
        url: "/user/reward-claims/check-claimed",
        method: "POST",
        body: { rewardType },
      }),
      providesTags: ["Rewards"],
    }),

    getAllResources: builder.query<ResourcesResponse, void>({
      query: () => ({
        url: "/user/resources",
        method: "GET",
      }),
      providesTags: ["Rewards"],
    }),

    getResourceById: builder.query<SingleResourceResponse, string>({
      query: (resourceId) => ({
        url: `/user/resources/${resourceId}`,
        method: "GET",
      }),
      providesTags: (_, __, resourceId) => [
        { type: "Rewards", id: resourceId },
      ],
    }),

    checkResourceClaimed: builder.query<CheckResourceClaimedResponse, string>({
      query: (resourceId) => ({
        url: `/user/reward-claims/check-resource-claimed/${resourceId}`,
        method: "GET",
      }),
      providesTags: (_, __, resourceId) => [
        { type: "Rewards", id: `claimed-${resourceId}` },
      ],
    }),
  }),
});

export const {
  useApplyForRewardMutation,
  useCheckRewardClaimedQuery,
  useLazyCheckRewardClaimedQuery,
  useGetAllResourcesQuery,
  useGetResourceByIdQuery,
  useCheckResourceClaimedQuery,
} = rewardsAndResourcesApi;
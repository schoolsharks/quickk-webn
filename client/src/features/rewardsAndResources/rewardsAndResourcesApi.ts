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

export interface ReferralStatsResponse {
  success: boolean;
  data: {
    totalReferrals: number;
    signedUp: number;
    converted: number;
    advertised: number;
  };
}

export interface ReferralUser {
  _id: string;
  name: string;
  companyMail: string;
  contact?: string;
  totalStars: number;
  webnClubMember: boolean;
  hasAdvertisementClaim: boolean;
  advertisementClaimId?: string;
  advertised?: boolean;
  lastUpdated?: string;
}

export interface ReferralUsersResponse {
  success: boolean;
  data: {
    users: ReferralUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MarkReferralAdvertisedResponse {
  success: boolean;
  message: string;
  data?: {
    claimId: string;
  };
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

    getReferralStats: builder.query<ReferralStatsResponse, void>({
      query: () => ({
        url: "/admin/referral/stats",
        method: "GET",
      }),
      providesTags: [{ type: "AdminReferralStats", id: "STATS" }],
    }),

    getReferralUsers: builder.query<
      ReferralUsersResponse,
      { search?: string; page?: number; limit?: number; sortBy?: string }
    >({
      query: (params) => ({
        url: "/admin/referral/users",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map((user) => ({
                type: "AdminReferralUsers" as const,
                id: user._id,
              })),
              { type: "AdminReferralUsers" as const, id: "LIST" },
            ]
          : [{ type: "AdminReferralUsers" as const, id: "LIST" }],
    }),

    markReferralAdvertised: builder.mutation<
      MarkReferralAdvertisedResponse,
      { claimId: string }
    >({
      query: ({ claimId }) => ({
        url: `/admin/referral/${claimId}/advertised`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "AdminReferralUsers", id: "LIST" },
        { type: "AdminReferralStats", id: "STATS" },
      ],
    }),

    // Admin Resources endpoints
    getResourcesStats: builder.query<
      { success: boolean; data: ResourcesStatsData },
      void
    >({
      query: () => ({
        url: "/resources/admin/stats",
        method: "GET",
      }),
      providesTags: [{ type: "AdminResourcesStats", id: "STATS" }],
    }),

    searchResourcesAdmin: builder.query<
      { success: boolean; data: ResourcesSearchResponse },
      ResourcesSearchParams
    >({
      query: (params) => ({
        url: "/resources/admin/search",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "AdminResources", id: "LIST" }],
    }),

    createResource: builder.mutation<
      { success: boolean; data: ResourceData },
      Partial<ResourceData> | FormData
    >({
      query: (resourceData) => ({
        url: "/resources/admin/create",
        method: "POST",
        body: resourceData,
      }),
      invalidatesTags: [
        { type: "AdminResources", id: "LIST" },
        { type: "AdminResourcesStats", id: "STATS" },
      ],
    }),

    updateResource: builder.mutation<
      { success: boolean; data: ResourceData },
      { resourceId: string; resourceData: Partial<ResourceData> | FormData }
    >({
      query: ({ resourceId, resourceData }) => ({
        url: `/resources/admin/${resourceId}`,
        method: "PUT",
        body: resourceData,
      }),
      invalidatesTags: [
        { type: "AdminResources", id: "LIST" },
        { type: "AdminResourcesStats", id: "STATS" },
      ],
    }),

    deleteResource: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (resourceId) => ({
        url: `/resources/admin/${resourceId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AdminResources", id: "LIST" },
        { type: "AdminResourcesStats", id: "STATS" },
      ],
    }),

    searchCompanies: builder.query<
      { success: boolean; data: CompanySearchResult[] },
      string
    >({
      query: (search) => ({
        url: "/resources/admin/companies/search",
        method: "GET",
        params: { search },
      }),
    }),
  }),
});

// Add interfaces for the new endpoints
export interface ResourcesStatsData {
  total: number;
  active: number;
  drafts: number;
  totalRedeemed: number;
}

export interface ResourceData {
  _id: string;
  heading: string;
  subHeading: string;
  image: string;
  companyName: string;
  companyLogo?: string;
  companyEmail?: string;
  companyContact?: string;
  type: "SERVICE" | "PRODUCT";
  targetAudience: string[];
  status: "ACTIVE" | "DRAFT";
  quantity: number;
  expiryDate: string;
  stars: number;
  totalRedeemed: number;
  description: {
    title: string;
    points: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourcesSearchResponse {
  resources: ResourceData[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResourcesSearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CompanySearchResult {
  businessName: string;
  businessLogo: string;
  companyMail: string;
  contact: string;
}

export const {
  useApplyForRewardMutation,
  useCheckRewardClaimedQuery,
  useLazyCheckRewardClaimedQuery,
  useGetAllResourcesQuery,
  useGetResourceByIdQuery,
  useCheckResourceClaimedQuery,
  useGetReferralStatsQuery,
  useGetReferralUsersQuery,
  useMarkReferralAdvertisedMutation,
  useGetResourcesStatsQuery,
  useSearchResourcesAdminQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useSearchCompaniesQuery,
  useLazySearchCompaniesQuery,
} = rewardsAndResourcesApi;
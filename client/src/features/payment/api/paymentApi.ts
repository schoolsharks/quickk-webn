import { api } from "../../../app/api";

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  purpose: "listing" | "membership" | "event";
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    paymentId: string;
  };
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
    purpose: string;
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: Array<{
    _id: string;
    userId: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    currency: string;
    status: string;
    purpose: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }>;
}

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/payment/create-order",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (data) => ({
        url: "/payment/verify",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    getPaymentHistory: builder.query<PaymentHistoryResponse, { purpose?: string }>({
      query: ({ purpose }) => ({
        url: "/payment/history",
        method: "GET",
        params: purpose ? { purpose } : undefined,
        credentials: "include",
      }),
    }),

    getPaymentById: builder.query<any, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentHistoryQuery,
  useLazyGetPaymentHistoryQuery,
  useGetPaymentByIdQuery,
  useLazyGetPaymentByIdQuery,
} = paymentApi;

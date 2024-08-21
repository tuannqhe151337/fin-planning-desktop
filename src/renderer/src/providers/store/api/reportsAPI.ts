import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import {
  AFFIX,
  Expense,
  ListResponse,
  LocalStorageItemKey,
  PaginationResponse,
} from "./type";

export interface ListReportParameters {
  query?: string | null;
  termId?: number | null;
  statusId?: number | null;
  page: number;
  pageSize: number;
}

export interface ListReportExpenseParameters {
  query?: string | null;
  currencyId?: number | null;
  reportId: number | null;
  statusId?: number | null;
  costTypeId?: number | null;
  page: number;
  pageSize: number;
}

export interface Report {
  reportId: number;
  name: string;
  version: string;
  month: string;
  term: Term;
  status: ReportStatus;
  createdAt: string;
}

export interface CostType {
  costTypeId: number;
  name: string;
}

export interface ReportDetailParameters {
  reportId: string | number;
}

export interface ReportDetail {
  id: string | number;
  name: string;
  term: Term;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportStatus {
  id: number;
  name: string;
  code: ReportStatusCode;
}

export type ReportStatusCode =
  | "NEW"
  | "WAITING_FOR_APPROVAL"
  | "REVIEWED"
  | "CLOSED";

export interface Term {
  termId: number;
  name: string;
  startDate: string;
  endDate: string;
  allowReupload: boolean;
  reuploadStartDate: string;
  reuploadEndDate: string;
  finalEndTermDate: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  userId: string | number;
  username: string;
  email: string;
  department: Department;
  role: Role;
  position: Position;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface Position {
  id: string | number;
  name: string;
}

export interface ReportExpectedCostResponse {
  cost: number;
  currency: Currency;
}

export interface ReportActualCostResponse {
  cost: number;
  currency: Currency;
}

export interface Currency {
  currencyId: number;
  name: string;
  symbol: string;
  affix: AFFIX;
}

export interface ReviewExpensesBody {
  reportId: number;
  listExpenseId: number[];
}

export interface ReviewExpenseResult {
  expenseId: number;
  expenseCode: string;
}

export interface UploadReportExpenses {
  reportId: number;
  listExpenses: ExpenseBody[];
}

export interface ExpenseBody {
  expenseId: number;
  statusCode: string;
}

export interface CompleteReviewReportBody {
  reportId: number;
}

// DEV ONLY!!!
// const pause = (duration: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duration);
//   });
// };

// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_HOST,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LocalStorageItemKey.TOKEN);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(1000);
      return fetch(...args);
    },
  }),
  {
    maxRetries: 5,
  },
);

const reportsAPI = createApi({
  reducerPath: "report",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["query", "report-detail", "actual-cost"],
  endpoints(builder) {
    return {
      fetchReports: builder.query<
        PaginationResponse<Report[]>,
        ListReportParameters
      >({
        query: ({ query, termId, statusId, page, pageSize }) => {
          let endpoint = `report/list?page=${page}&size=${pageSize}`;

          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }

          if (termId) {
            endpoint += `&termId=${termId}`;
          }

          if (statusId) {
            endpoint += `&statusId=${statusId}`;
          }

          return endpoint;
        },
      }),

      getReportDetail: builder.query<ReportDetail, ReportDetailParameters>({
        query: ({ reportId }) => `/report/detail?reportId=${reportId}`,
        providesTags: ["report-detail"],
      }),

      getReportActualCost: builder.query<
        ReportActualCostResponse,
        ReportDetailParameters
      >({
        query: ({ reportId }) => `/report/actual-cost?reportId=${reportId}`,
        providesTags: ["actual-cost"],
      }),

      getReportExpectedCost: builder.query<
        ReportExpectedCostResponse,
        ReportDetailParameters
      >({
        query: ({ reportId }) => `/report/expected-cost?reportId=${reportId}`,
      }),

      fetchReportExpenses: builder.query<
        PaginationResponse<Expense[]>,
        ListReportExpenseParameters
      >({
        query: ({
          query,
          reportId,
          currencyId,
          costTypeId,
          statusId,
          page,
          pageSize,
        }) => {
          let endpoint = `report/expenses?reportId=${reportId}&page=${page}&size=${pageSize}`;

          if (currencyId) {
            endpoint += `&currencyId=${currencyId}`;
          }

          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }

          if (costTypeId) {
            endpoint += `&costTypeId=${costTypeId}`;
          }

          if (statusId) {
            endpoint += `&statusId=${statusId}`;
          }

          return endpoint;
        },
      }),

      approveExpenses: builder.mutation<
        ListResponse<ReviewExpenseResult[]>,
        ReviewExpensesBody
      >({
        query: (reviewExpenseBody) => ({
          url: "report/expense-approval",
          method: "PUT",
          body: reviewExpenseBody,
        }),
        invalidatesTags: ["actual-cost"],
      }),

      denyExpenses: builder.mutation<any, ReviewExpensesBody>({
        query: (reviewExpenseBody) => ({
          url: "report/expense-deny",
          method: "PUT",
          body: reviewExpenseBody,
        }),
        invalidatesTags: ["actual-cost"],
      }),
      reviewListExpenses: builder.mutation<any, UploadReportExpenses>({
        query: (uploadReportExpenses) => ({
          url: "report/upload",
          method: "POST",
          body: uploadReportExpenses,
        }),
        invalidatesTags: ["actual-cost", "query"],
      }),

      markAsReviewed: builder.mutation<void, CompleteReviewReportBody>({
        query: (completeReviewReportBody) => ({
          url: "report/complete-review",
          method: "POST",
          body: completeReviewReportBody,
        }),
        invalidatesTags: ["report-detail"],
      }),
    };
  },
});

export const {
  useFetchReportsQuery,
  useGetReportActualCostQuery,
  useLazyGetReportActualCostQuery,
  useGetReportExpectedCostQuery,
  useLazyGetReportExpectedCostQuery,
  useLazyFetchReportsQuery,
  useGetReportDetailQuery,
  useLazyGetReportDetailQuery,
  useLazyFetchReportExpensesQuery,
  useApproveExpensesMutation,
  useDenyExpensesMutation,
  useReviewListExpensesMutation,
  useMarkAsReviewedMutation,
} = reportsAPI;
export { reportsAPI };

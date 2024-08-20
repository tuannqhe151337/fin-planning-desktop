import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Expense,
  ListResponse,
  LocalStorageItemKey,
  PaginationResponse,
} from "./type";

export interface ListPlanParameters {
  query?: string | null;
  termId?: number | null;
  departmentId?: number | null;
  page: number;
  pageSize: number;
}

export interface ListPlanExpenseParameters {
  query?: string | null;
  planId: number | null;
  statusId?: number | null;
  costTypeId?: number | null;
  currencyId?: number | null;
  page: number;
  pageSize: number;
}

export interface PlanPreview {
  planId: number | string;
  name: string;
  term: Term;
  role: Role;
  department: UserDepartment;
  version: number;
  isDelete: boolean;
}

export interface PlanDetailParameters {
  planId: string | number;
}

export interface PlanDetail {
  id: string | number;
  name: string;
  actualCost: ActualCost;
  expectedCost: ExpectedCost;
  term: Term;
  planDueDate: string;
  createdAt: string;
  department: PlanDepartment;
  user: User;
  version: number;
}

export interface ExpectedCost {
  cost: number;
  currency: Currency;
}

export interface ActualCost {
  cost: number;
  currency: Currency;
}

export interface Currency {
  currencyId: 1;
  name: string;
  symbol: string;
  affix: string;
}

export interface CostType {
  costTypeId: number;
  name: string;
  code: string;
}

export interface PlanDeleteParameters {
  planId: string | number;
}

export interface PlanVersion {
  planFileId: string | number;
  version: number;
  publishedDate: string;
  uploadedBy: User;
}

export interface PlanVersionParameters {
  planId: string | number;
  page: number;
  pageSize: number;
}

export interface User {
  userId: string | number;
  username: string;
  email: string;
  department: UserDepartment;
  role: Role;
  position: Position;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string | number;
  name: string;
}

export interface Term {
  termId: number;
  name: string;
  startDate: string;
  endDate: string;
  reuploadStartDate: string;
  reuploadEndDate: string;
  finalEndTermDate: string;
}

export interface UserDepartment {
  departmentId: number;
  name: string;
}

export interface PlanDepartment {
  departmentId: number;
  name: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface CreatePlanBody {
  termId: string | number;
  planName: string;
  fileName: string;
  expenses: ExpenseBody[];
}

export interface ExpenseBody {
  name: string;
  costTypeId: number;
  unitPrice: number;
  amount: number;
  projectId: number;
  supplierId: number;
  picId: number;
  notes?: string | number;
  currencyId: number;
}

export interface ReuploadPlanBody {
  planId: string | number;
  data: ReuploadExpenseBody[];
}

export interface ReuploadExpenseBody {
  expenseId: number;
  // expenseCode: string;
  expenseName: string;
  costTypeId: number;
  unitPrice: number;
  amount: number;
  projectId: number;
  supplierId: number;
  picId: number;
  notes?: string | number;
  currencyId: number;
}

export interface ReviewExpensesBody {
  planId: number;
  listExpenseId: number[];
}

export interface SubmitPlanBody {
  planId: number;
}

export interface CheckUserExistBody {
  usernameList: string[];
}

export interface UserResponse {
  userId: number;
  username: string;
}

export interface InfinteScrollPlansOfTermParam {
  termId: number;
  page: number;
  pageSize: number;
}

// DEV ONLY!!!
// const pause = (duration: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duration);
//   });
// };

const plansApi = createApi({
  reducerPath: "plans",
  baseQuery: fetchBaseQuery({
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
      // await pause(2000);
      return fetch(...args);
    },
  }),
  tagTypes: ["plans", "plan-detail", "plan-expenses"],
  endpoints(builder) {
    return {
      fetchPlans: builder.query<
        PaginationResponse<PlanPreview[]>,
        ListPlanParameters
      >({
        query: ({ query, termId, departmentId, page, pageSize }) => {
          let endpoint = `plan/list?page=${page}&size=${pageSize}`;

          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }

          if (departmentId) {
            endpoint += `&departmentId=${departmentId}`;
          }

          if (termId) {
            endpoint += `&termId=${termId}`;
          }

          return endpoint;
        },
        providesTags: ["plans"],
      }),

      fetchInfinteScrollPlansOfTerm: builder.query<
        PaginationResponse<PlanPreview[]>,
        InfinteScrollPlansOfTermParam
      >({
        query: ({ termId, page, pageSize }) =>
          `plan/list?termId=${termId}&page=${page}&size=${pageSize}`,
        providesTags: ["plans"],
        // Only have one cache entry because the arg always maps to one string
        serializeQueryArgs: ({ endpointName }) => {
          return endpointName;
        },
        // Merge to exists cache, if page === 0 then invalidate all cache
        // https://stackoverflow.com/questions/72530121/rtk-query-infinite-scrolling-retaining-existing-data
        // https://github.com/reduxjs/redux-toolkit/issues/2874
        merge(currentCacheData, responseData, { arg: { page } }) {
          if (page > 1) {
            currentCacheData.data.push(...responseData.data);
            currentCacheData.pagination = responseData.pagination;
          } else if (page <= 1) {
            currentCacheData = responseData;
          }

          return currentCacheData;
        },
        // Refetch when the page arg changes
        forceRefetch({ currentArg, previousArg }) {
          return currentArg !== previousArg;
        },
      }),

      getPlanDetail: builder.query<PlanDetail, PlanDetailParameters>({
        query: ({ planId }) => `/plan/detail?planId=${planId}`,
        providesTags: ["plan-detail"],
      }),

      deletePlan: builder.mutation<any, PlanDeleteParameters>({
        query: ({ planId }) => ({
          url: `/plan/delete`,
          method: "DELETE",
          body: { planId },
        }),
        invalidatesTags: ["plans"],
      }),

      getPlanVersion: builder.query<
        PaginationResponse<PlanVersion[]>,
        PlanVersionParameters
      >({
        query: ({ page, pageSize, planId }) =>
          `/plan/versions?planId=${planId}&page=${page}&size=${pageSize}`,
        providesTags: ["plan-detail"],
        // Only have one cache entry because the arg always maps to one string
        serializeQueryArgs: ({ endpointName }) => {
          return endpointName;
        },
        // Merge to exists cache, if page === 0 then invalidate all cache
        // https://stackoverflow.com/questions/72530121/rtk-query-infinite-scrolling-retaining-existing-data
        // https://github.com/reduxjs/redux-toolkit/issues/2874
        merge(currentCacheData, responseData, { arg: { page } }) {
          if (page > 1) {
            currentCacheData.data.push(...responseData.data);
            currentCacheData.pagination = responseData.pagination;
          } else if (page <= 1) {
            currentCacheData = responseData;
          }

          return currentCacheData;
        },
        // Refetch when the page arg changes
        forceRefetch({ currentArg, previousArg }) {
          return currentArg !== previousArg;
        },
      }),

      createPlan: builder.mutation<any, CreatePlanBody>({
        query: (createPlanBody) => ({
          url: `plan/create`,
          method: "POST",
          body: createPlanBody,
        }),
        invalidatesTags: ["plans"],
      }),

      checkUserExist: builder.mutation<
        ListResponse<UserResponse[]>,
        CheckUserExistBody
      >({
        query: (checkUserExistBody) => ({
          url: `plan/check-user-exist`,
          method: "POST",
          body: checkUserExistBody,
        }),
      }),

      fetchPlanExpenses: builder.query<
        PaginationResponse<Expense[]>,
        ListPlanExpenseParameters
      >({
        query: ({
          query,
          planId,
          costTypeId,
          statusId,
          currencyId,
          page,
          pageSize,
        }) => {
          let endpoint = `plan/expenses?planId=${planId}&page=${page}&size=${pageSize}`;

          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }

          if (currencyId) {
            endpoint += `&currencyId=${currencyId}`;
          }

          if (costTypeId) {
            endpoint += `&costTypeId=${costTypeId}`;
          }

          if (statusId) {
            endpoint += `&statusId=${statusId}`;
          }

          return endpoint;
        },
        providesTags: ["plan-detail", "plan-expenses"],
      }),

      reuploadPlan: builder.mutation<any, ReuploadPlanBody>({
        query: (reuploadPlanBody) => ({
          url: "plan/re-upload",
          method: "PUT",
          body: reuploadPlanBody,
        }),
        invalidatesTags: ["plan-detail"],
      }),

      // approveExpenses: builder.mutation<any, ReviewExpensesBody>({
      //   query: (reviewExpenseBody) => ({
      //     url: "plan/expense-approval",
      //     method: "PUT",
      //     body: reviewExpenseBody,
      //   }),
      // }),
      // denyExpenses: builder.mutation<any, ReviewExpensesBody>({
      //   query: (reviewExpenseBody) => ({
      //     url: "plan/expense-deny",
      //     method: "PUT",
      //     body: reviewExpenseBody,
      //   }),
      // }),
      // submitPlanForReview: builder.mutation<any, SubmitPlanBody>({
      //   query: (submitPlanBody) => ({
      //     url: "plan/submit-for-review",
      //     method: "PUT",
      //     body: submitPlanBody,
      //   }),
      //   invalidatesTags: ["plan-detail"],
      // }),
    };
  },
});

export const {
  useFetchPlansQuery,
  useLazyFetchPlansQuery,
  useLazyFetchInfinteScrollPlansOfTermQuery,
  useGetPlanDetailQuery,
  useLazyGetPlanDetailQuery,
  useDeletePlanMutation,
  useLazyGetPlanVersionQuery,
  useCreatePlanMutation,
  useFetchPlanExpensesQuery,
  useLazyFetchPlanExpensesQuery,
  useReuploadPlanMutation,
  useCheckUserExistMutation,
  // useApproveExpensesMutation,
  // useDenyExpensesMutation,
  // useSubmitPlanForReviewMutation,
} = plansApi;
export { plansApi };

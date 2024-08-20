import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey } from "./type";

export interface YearlyCostTypeResult {
  costType: CostType;
  totalCost: number;
}

export interface YearlyCostTypeExpenseByYearParam {
  year: number;
}

export interface MonthlyCostTypeResult {
  month: string;
  diagramResponses: MonthlyDiagramResponses[];
}

export interface MonthlyDiagramResponses {
  costType: CostType;
  totalCost: number;
}

export interface MonthlyCostTypeExpenseByYearParam {
  year: number;
}

export interface CostType {
  costTypeId: number;
  name: string;
}

export interface MonthlyExpectedActualCost {
  month: number;
  expectedCost: number;
  actualCost: number;
}

export interface MonthlyExpectedActualCostParam {
  year: number;
}

export interface MonthlyUserStats {
  month: string;
  numberUserCreated: number;
  numberUserDeleted: number;
}

export interface MonthlyUserStatsParam {
  year: number;
}

export interface DepartmentUserStats {
  department: Department;
  numberUser: number;
}

export interface Department {
  id: number;
  name: string;
}

export interface DepartmentUserStatsParam {
  year: number;
}

export interface AdminStatistic {
  totalDepartment: number;
  totalEmployee: number;
  totalPosition: number;
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
  }
);

const dashboardApi = createApi({
  reducerPath: "dashboard",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["dashboard"],
  endpoints(builder) {
    return {
      getYearlyCostTypeExpense: builder.query<
        ListResponse<YearlyCostTypeResult[]>,
        YearlyCostTypeExpenseByYearParam
      >({
        query: ({ year }) => `/report/cost-type-year-diagram?year=${year}`,
      }),
      getMonthlyCostTypeExpense: builder.query<
        ListResponse<MonthlyCostTypeResult[]>,
        MonthlyCostTypeExpenseByYearParam
      >({
        query: ({ year }) => `/report/cost-type-report-diagram?year=${year}`,
      }),
      getMonthlyExpectedActualCost: builder.query<
        ListResponse<MonthlyExpectedActualCost[]>,
        MonthlyExpectedActualCostParam
      >({
        query: ({ year }) => `/report/year-diagram?year=${year}`,
      }),
      getMonthlyUserStats: builder.query<
        ListResponse<MonthlyUserStats[]>,
        MonthlyUserStatsParam
      >({
        query: ({ year }) =>
          `/user/user-created-over-time-diagram?year=${year}`,
      }),
      getDepartmentUserStats: builder.query<
        ListResponse<DepartmentUserStats[]>,
        DepartmentUserStatsParam
      >({
        query: ({ year }) =>
          `/user/number-user-of-department-diagram?year=${year}`,
      }),
      getAdminStatistic: builder.query<AdminStatistic, void>({
        query: () => `/admin/statistic`,
      }),
    };
  },
});

export const {
  useLazyGetYearlyCostTypeExpenseQuery,
  useLazyGetMonthlyCostTypeExpenseQuery,
  useLazyGetMonthlyExpectedActualCostQuery,
  useLazyGetMonthlyUserStatsQuery,
  useLazyGetDepartmentUserStatsQuery,
  useLazyGetAdminStatisticQuery,
} = dashboardApi;
export { dashboardApi };

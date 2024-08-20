import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey, PaginationResponse } from "./type";

export interface ListAnnualReportParameters {
  query?: string | null;
  year?: number;
  page: number;
  pageSize: number;
}

export interface ListAnnualReportExpenseParameters {
  annualReportId: number;
  costTypeId?: number | null;
  departmentId?: number | null;
  page: number;
  pageSize: number;
}

export interface AnnualReport {
  annualReportId: number;
  name: string;
  totalTerm: number;
  totalExpense: number;
  totalDepartment: number;
  createdAt: string;
}

export interface AnnualReportExpense {
  expenseId: number | string;
  department: Department;
  totalExpenses: number;
  biggestExpenditure: number;
  costType: CostType;
}

export interface AnnualReportChart {
  costType: CostType;
  totalCost: number;
}

interface Department {
  id: number;
  name: string;
}

interface CostType {
  costTypeId: number;
  name: string;
  code: string;
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

const annualAPI = createApi({
  reducerPath: "annual",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["annual"],
  endpoints(builder) {
    return {
      fetchAnnual: builder.query<
        PaginationResponse<AnnualReport[]>,
        ListAnnualReportParameters
      >({
        query: ({ query, year, page, pageSize }) => {
          let endpoint = `/annual-report/list?page=${page}&size=${pageSize}`;
          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }
          if (year) {
            endpoint += `&year=${year}`;
          }
          return endpoint;
        },
      }),
      fetchAnnualReportExpense: builder.query<
        PaginationResponse<AnnualReportExpense[]>,
        ListAnnualReportExpenseParameters
      >({
        query: ({
          annualReportId,
          costTypeId,
          departmentId,
          page,
          pageSize,
        }) => {
          let endpoint = `annual-report/expenses?annualReportId=${annualReportId}&page=${page}&size=${pageSize}`;
          if (costTypeId) {
            endpoint += `&costTypeId=${costTypeId}`;
          }
          if (departmentId) {
            endpoint += `&departmentId=${departmentId}`;
          }
          return endpoint;
        },

        providesTags: ["annual"],
      }),

      fetchAnnualReportDetail: builder.query<AnnualReport, number>({
        query: (year) => `annual-report/detail?year=${year}`,
        providesTags: ["annual"],
      }),

      fetchAnnualReportChart: builder.query<
        ListResponse<AnnualReportChart[]>,
        number
      >({
        query: (annualReportId) =>
          `annual-report/diagram?annualReportId=${annualReportId}`,
        providesTags: ["annual"],
      }),
    };
  },
});

export const {
  useFetchAnnualQuery,
  useLazyFetchAnnualQuery,
  useFetchAnnualReportExpenseQuery,
  useLazyFetchAnnualReportExpenseQuery,
  useFetchAnnualReportDetailQuery,
  useLazyFetchAnnualReportDetailQuery,
  useFetchAnnualReportChartQuery,
  useLazyFetchAnnualReportChartQuery,
} = annualAPI;
export { annualAPI };

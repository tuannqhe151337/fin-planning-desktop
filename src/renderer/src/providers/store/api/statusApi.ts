import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import {
  ExpenseStatus,
  ListResponse,
  LocalStorageItemKey,
  PaginationResponse,
} from "./type";

export interface ReportStatus {
  statusId: number;
  code: string;
  name: string;
}

export interface TermStatus {
  id: number;
  code: string;
  name: string;
}

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
  }),
  {
    maxRetries: 5,
  },
);

export const statusAPI = createApi({
  reducerPath: "statusAPI",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getListStatusTerm: builder.query<PaginationResponse<TermStatus[]>, void>({
      query: () => {
        return `/term-status/term-status-list`;
      },
    }),
    getListStatusReport: builder.query<
      PaginationResponse<ReportStatus[]>,
      void
    >({
      query: () => {
        return `/report/report-status`;
      },
    }),
    getAllExpenseStatus: builder.query<ListResponse<ExpenseStatus[]>, void>({
      query: () => {
        return `/plan/expense-status`;
      },
    }),
  }),
});

export const {
  useGetListStatusTermQuery,
  useGetListStatusReportQuery,
  useGetAllExpenseStatusQuery,
} = statusAPI;

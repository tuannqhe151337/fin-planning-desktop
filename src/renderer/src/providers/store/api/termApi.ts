import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey, PaginationResponse } from "./type";

export enum Duration {
  "MONTHLY" = "MONTHLY",
  "QUARTERLY" = "QUARTERLY",
  "HALF_YEARLY" = "HALF_YEARLY",
}

export type TermStatusCode = "IN_PROGRESS" | "NEW" | "CLOSED";

export interface CreateTermBody {
  name: string;
  duration: Duration;
  startDate: string;
  endDate: string;
  allowReupload: boolean;
  reuploadStartDate?: string;
  reuploadEndDate?: string;
}

export interface UpdateTermBody {
  id: number;
  name: string;
  duration: Duration;
  startDate: string;
  endDate: string;
  allowReupload: boolean;
  reuploadStartDate?: string;
  reuploadEndDate?: string;
}

export interface StartTermBody {
  termId: string | number;
}

export interface DeleteTermBody {
  id: string | number;
}

export interface Term {
  termId: number | string;
  name: string;
  status: Status;
  startDate: string;
  endDate: string;
}

interface Status {
  id: number;
  name: string;
  code: TermStatusCode;
}

export interface ListTermParameters {
  query?: string;
  statusId?: number | null;
  page: number;
  pageSize: number;
}

export interface TermCreatePlan {
  termId: string | number;
  name: string;
  duration: string;
  startDate: string;
  endDate: string;
}

export interface TermDetail {
  id: number | string;
  name: string;
  duration: Duration;
  startDate: string;
  endDate: string;
  allowReupload: boolean;
  reuploadStartDate: string;
  reuploadEndDate: string;
  finalEndTermDate: string;
  status: StatusTermDetail;
}

interface StatusTermDetail {
  // id: number;
  name: string;
  code: string;
  isDelete: Boolean;
}

export interface ListTermWhenCreatePlanParameters {
  query?: string;
  page: number;
  pageSize: number;
}

export interface TermInterval {
  startTermDate: number;
  endTermInterval: number;
  startReuploadInterval: number;
  endReuploadInterval: number;
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

export const termAPI = createApi({
  reducerPath: "termAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["terms"],
  endpoints: (builder) => ({
    getListTerm: builder.query<PaginationResponse<Term[]>, ListTermParameters>({
      query: ({ query, statusId, page, pageSize }) => {
        let endpoint = `term/plan-paging-term?page=${page}&size=${pageSize}`;

        if (query && query !== "") {
          endpoint += `&query=${query}`;
        }

        if (statusId) {
          endpoint += `&statusId=${statusId}`;
        }

        return endpoint;
      },
      providesTags: ["terms"],
    }),

    getListTermInterval: builder.query<TermInterval, void>({
      query: () => `/term/termInterval`,
    }),

    getListTermWhenCreatePlan: builder.query<
      PaginationResponse<TermCreatePlan[]>,
      ListTermWhenCreatePlanParameters
    >({
      query: ({ query, page, pageSize }) => {
        let endpoint = `term/plan-create-select-term?page=${page}&size=${pageSize}`;

        if (query && query !== "") {
          endpoint += `&query=${query}`;
        }

        return endpoint;
      },
    }),

    createTerm: builder.mutation<any, CreateTermBody>({
      query: (createTermBody) => ({
        url: "term",
        method: "POST",
        body: createTermBody,
      }),
      invalidatesTags: ["terms"],
    }),

    fetchTermDetail: builder.query<TermDetail, number>({
      query: (id) => `term/${id}`,
      providesTags: ["terms"],
    }),

    updateTerm: builder.mutation<any, UpdateTermBody>({
      query: (updateTermBody) => ({
        url: "term",
        method: "PUT",
        body: updateTermBody,
      }),
      invalidatesTags: ["terms"],
    }),

    startTerm: builder.mutation<any, StartTermBody>({
      query: (startTermBody) => ({
        url: "term/start",
        method: "POST",
        body: startTermBody,
      }),
      invalidatesTags: ["terms"],
    }),

    deleteTerm: builder.mutation<any, DeleteTermBody>({
      query: (deleteTermBody) => ({
        url: "term",
        method: "DELETE",
        body: deleteTermBody,
      }),
      invalidatesTags: ["terms"],
    }),
  }),
});

export const {
  useLazyGetListTermQuery,
  useLazyGetListTermWhenCreatePlanQuery,
  useGetListTermIntervalQuery,
  useCreateTermMutation,
  useFetchTermDetailQuery,
  useLazyFetchTermDetailQuery,
  useUpdateTermMutation,
  useStartTermMutation,
  useDeleteTermMutation,
} = termAPI;

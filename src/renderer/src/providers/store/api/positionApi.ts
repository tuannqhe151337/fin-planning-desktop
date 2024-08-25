import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey, PaginationResponse } from "./type";
import { trimObject } from "../../../shared/utils/trim-object";

export interface Position {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListPositionParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeletePositionBody {
  positionId: number;
}

export interface CreatePositionBody {
  positionName: string;
}

export interface UpdatePositionBody {
  positionId: number;
  positionName: string;
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
  }
);

export const positionAPI = createApi({
  reducerPath: "positionAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["positions"],
  endpoints: (builder) => ({
    getListPosition: builder.query<
      PaginationResponse<Position[]>,
      ListPositionParameters
    >({
      query: ({ page, pageSize, query }) => {
        return `/position/user-paging-position?page=${page}&size=${pageSize}&query=${query}`;
      },
      providesTags: ["positions"],
    }),
    createPosition: builder.mutation<any, CreatePositionBody>({
      query: (createPositionBody) => ({
        url: `/position/create`,
        method: "POST",
        body: trimObject(createPositionBody),
      }),
      invalidatesTags: ["positions"],
    }),
    updatePosition: builder.mutation<any, UpdatePositionBody>({
      query: (updatePositionBody) => ({
        url: `/position/update`,
        method: "PUT",
        body: trimObject(updatePositionBody),
      }),
      invalidatesTags: ["positions"],
    }),
    deletePosition: builder.mutation<any, DeletePositionBody>({
      query: (deletePositionBody) => ({
        url: `/position`,
        method: "DELETE",
        body: trimObject(deletePositionBody),
      }),
      invalidatesTags: ["positions"],
    }),
  }),
});

export const {
  useLazyGetListPositionQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = positionAPI;

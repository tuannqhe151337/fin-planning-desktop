import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey, PaginationResponse } from "./type";

export interface CostType {
  costTypeId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListCostTypeParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteCostTypeBody {
  costTypeId: number;
}

export interface CreateCostTypeBody {
  costTypeName: string;
}

export interface UpdateCostTypeBody {
  costTypeId: number;
  costTypeName: string;
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

export const costTypeAPI = createApi({
  reducerPath: "costTypeAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["cost-types"],
  endpoints: (builder) => ({
    getListCostType: builder.query<
      PaginationResponse<CostType[]>,
      ListCostTypeParameters
    >({
      query: ({ page, pageSize, query, sortBy, sortType }) => {
        let url = `/cost-type/list-paginate?page=${page}&size=${pageSize}`;

        if (query) {
          url += `&query=${query}`;
        }

        if (sortBy) {
          url += `&sortBy=${sortBy}`;
        }

        if (sortType) {
          url += `&sortType=${sortType}`;
        }

        return url;
      },
      providesTags: ["cost-types"],
    }),
    getAllCostType: builder.query<ListResponse<CostType[]>, void>({
      query: () => ({
        url: `/cost-type/list`,
      }),
      providesTags: ["cost-types"],
    }),
    createCostType: builder.mutation<any, CreateCostTypeBody>({
      query: (createCostTypeBody) => ({
        url: `/cost-type/create`,
        method: "POST",
        body: createCostTypeBody,
      }),
      invalidatesTags: ["cost-types"],
    }),
    updateCostType: builder.mutation<any, UpdateCostTypeBody>({
      query: (updateCostTypeBody) => ({
        url: `/cost-type/update`,
        method: "PUT",
        body: updateCostTypeBody,
      }),
      invalidatesTags: ["cost-types"],
    }),
    deleteCostType: builder.mutation<any, DeleteCostTypeBody>({
      query: (deleteCostTypeBody) => ({
        url: `/cost-type`,
        method: "DELETE",
        body: deleteCostTypeBody,
      }),
      invalidatesTags: ["cost-types"],
    }),
  }),
});

export const {
  useGetListCostTypeQuery,
  useGetAllCostTypeQuery,
  useLazyGetListCostTypeQuery,
  useDeleteCostTypeMutation,
  useCreateCostTypeMutation,
  useUpdateCostTypeMutation,
} = costTypeAPI;

import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey, PaginationResponse } from "./type";
import { trimObject } from "../../../shared/utils/trim-object";

export interface Department {
  departmentId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListDepartmentParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteDepartmentBody {
  departmentId: number;
}

export interface CreateDepartmentBody {
  departmentName: string;
}

export interface UpdateDepartmentBody {
  departmentId: number;
  departmentName: string;
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

export const departmentAPI = createApi({
  reducerPath: "departmentAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["departments"],
  endpoints: (builder) => ({
    getListDepartment: builder.query<
      PaginationResponse<Department[]>,
      ListDepartmentParameters
    >({
      query: ({ page, pageSize, query, sortBy, sortType }) => {
        let url = `/department/list-paginate?page=${page}&size=${pageSize}`;

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
      providesTags: ["departments"],
    }),
    getAllDepartment: builder.query<ListResponse<Department[]>, void>({
      query: () => ({
        url: `/department/list`,
      }),
      providesTags: ["departments"],
    }),
    createDepartment: builder.mutation<any, CreateDepartmentBody>({
      query: (createDepartmentBody) => ({
        url: `/department/create`,
        method: "POST",
        body: trimObject(createDepartmentBody),
      }),
      invalidatesTags: ["departments"],
    }),
    updateDepartment: builder.mutation<any, UpdateDepartmentBody>({
      query: (updateDepartmentBody) => ({
        url: `/department/update`,
        method: "PUT",
        body: trimObject(updateDepartmentBody),
      }),
      invalidatesTags: ["departments"],
    }),
    deleteDepartment: builder.mutation<any, DeleteDepartmentBody>({
      query: (deleteDepartmentBody) => ({
        url: `/department`,
        method: "DELETE",
        body: trimObject(deleteDepartmentBody),
      }),
      invalidatesTags: ["departments"],
    }),
  }),
});

export const {
  useLazyGetListDepartmentQuery,
  useGetAllDepartmentQuery,
  useDeleteDepartmentMutation,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentAPI;

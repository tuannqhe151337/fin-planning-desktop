import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey, PaginationResponse } from "./type";

export interface Supplier {
  supplierId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListSupplierParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteSupplierBody {
  supplierId: number;
}

export interface CreateSupplierBody {
  supplierName: string;
}

export interface UpdateSupplierBody {
  supplierId: number;
  supplierName: string;
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

export const supplierAPI = createApi({
  reducerPath: "supplierAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["suppliers"],
  endpoints: (builder) => ({
    getListSupplier: builder.query<
      PaginationResponse<Supplier[]>,
      ListSupplierParameters
    >({
      query: ({ page, pageSize, query }) => {
        return `/supplier/list-paginate?page=${page}&size=${pageSize}&query=${query}`;
      },
      providesTags: ["suppliers"],
    }),

    getAllSupplier: builder.query<ListResponse<Supplier[]>, void>({
      query: () => `/supplier/list`,
    }),

    createSupplier: builder.mutation<any, CreateSupplierBody>({
      query: (createSupplierBody) => ({
        url: `/supplier/create`,
        method: "POST",
        body: createSupplierBody,
      }),
      invalidatesTags: ["suppliers"],
    }),

    updateSupplier: builder.mutation<any, UpdateSupplierBody>({
      query: (updateSupplierBody) => ({
        url: `/supplier/update`,
        method: "PUT",
        body: updateSupplierBody,
      }),
      invalidatesTags: ["suppliers"],
    }),

    deleteSupplier: builder.mutation<any, DeleteSupplierBody>({
      query: (deleteSupplierBody) => ({
        url: `/supplier`,
        method: "DELETE",
        body: deleteSupplierBody,
      }),
      invalidatesTags: ["suppliers"],
    }),
  }),
});

export const {
  useLazyGetListSupplierQuery,
  useGetAllSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierAPI;

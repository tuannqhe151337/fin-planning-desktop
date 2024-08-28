import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import {
  AFFIX,
  ListResponse,
  LocalStorageItemKey,
  PaginationResponse,
} from "./type";
import { trimObject } from "../../../shared/utils/trim-object";

export interface Currency {
  currencyId: number;
  name: string;
  symbol: string;
  affix: AFFIX;
  default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCurrencyParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteCurrencyBody {
  currencyId: number;
}

export interface CreateCurrencyBody {
  currencyName: string;
  currencySymbol?: string;
  currencyAffix?: AFFIX;
}

export interface UpdateCurrencyBody {
  currencyId: number;
  currencyName: string;
  currencySymbol?: string;
  currencyAffix?: AFFIX;
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

export const currencyApi = createApi({
  reducerPath: "currencyAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["currencies"],
  endpoints: (builder) => ({
    getListCurrency: builder.query<
      PaginationResponse<Currency[]>,
      ListCurrencyParameters
    >({
      query: ({ page, pageSize, query, sortBy, sortType }) => {
        let url = `/currency/list-paginate?page=${page}&size=${pageSize}`;

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
      providesTags: ["currencies"],
    }),
    getAllCurrency: builder.query<ListResponse<Currency[]>, void>({
      query: () => ({
        url: `/currency/list`,
      }),
      providesTags: ["currencies"],
    }),
    createCurrency: builder.mutation<any, CreateCurrencyBody>({
      query: (createCurrencyBody) => ({
        url: `/currency/create`,
        method: "POST",
        body: trimObject(createCurrencyBody),
      }),
      invalidatesTags: ["currencies"],
    }),
    updateCurrency: builder.mutation<any, UpdateCurrencyBody>({
      query: (updateCurrencyBody) => ({
        url: `/currency/update`,
        method: "PUT",
        body: trimObject(updateCurrencyBody),
      }),
      invalidatesTags: ["currencies"],
    }),
    deleteCurrency: builder.mutation<any, DeleteCurrencyBody>({
      query: (deleteCurrencyBody) => ({
        url: `/currency`,
        method: "DELETE",
        body: trimObject(deleteCurrencyBody),
      }),
      invalidatesTags: ["currencies"],
    }),
  }),
});

export const {
  useLazyGetListCurrencyQuery,
  useGetAllCurrencyQuery,
  useDeleteCurrencyMutation,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
} = currencyApi;

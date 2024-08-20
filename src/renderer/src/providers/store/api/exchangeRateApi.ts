import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { AFFIX, LocalStorageItemKey, PaginationResponse } from "./type";

export interface MonthlyExchangeRate {
  month: string;
  exchangeRates: ExchangeRate[];
}

export interface ExchangeRate {
  exchangeRateId: number;
  currency: Currency;
  amount: number;
}

export interface Currency {
  currencyId: number;
  name: string;
  symbol: string;
  affix: AFFIX;
}

export interface ListMonthlyExchangeRateParameters {
  year?: number;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteMonthlyExchangeRateBody {
  month: string;
}

export interface CreateMonthlyExchangeRateBody {
  month: string;
  exchangeRates: ExchangeRateBody[];
}

export interface UpdateMonthlyExchangeRateBody {
  exchangeId: number;
  amount: number;
}

export interface CreateExchangeRateBody {
  month: string;
  currencyId: number;
  amount: number;
}

export interface ExchangeRateBody {
  currencyId: number;
  amount: number;
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

export const exchangeRateAPI = createApi({
  reducerPath: "exchangeRate",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["exchange-rate"],
  endpoints: (builder) => ({
    getListMonthlyExchangeRate: builder.query<
      PaginationResponse<MonthlyExchangeRate[]>,
      ListMonthlyExchangeRateParameters
    >({
      query: ({ year, page, pageSize, sortBy, sortType }) => {
        let url = `/exchange/list-paginate?page=${page}&size=${pageSize}`;

        if (year) {
          url += `&year=${year}`;
        }

        if (sortBy) {
          url += `&sortBy=${sortBy}`;
        }

        if (sortType) {
          url += `&sortType=${sortType}`;
        }

        return url;
      },
      providesTags: ["exchange-rate"],
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

    createMonthlyExchangeRate: builder.mutation<
      any,
      CreateMonthlyExchangeRateBody
    >({
      query: (createExchangeRateBody) => ({
        url: `/exchange/create`,
        method: "POST",
        body: createExchangeRateBody,
      }),
      invalidatesTags: ["exchange-rate"],
    }),

    updateMonthlyExchangeRate: builder.mutation<
      any,
      UpdateMonthlyExchangeRateBody
    >({
      query: (updateExchangeRateBody) => ({
        url: `/exchange/update`,
        method: "PUT",
        body: updateExchangeRateBody,
      }),
      invalidatesTags: ["exchange-rate"],
    }),

    createExchangeRate: builder.mutation<any, CreateExchangeRateBody>({
      query: (createExchangeRateBody) => ({
        url: `/exchange/update/new-exchange-rate`,
        method: "POST",
        body: createExchangeRateBody,
      }),
      invalidatesTags: ["exchange-rate"],
    }),

    deleteMonthlyExchangeRate: builder.mutation<
      any,
      DeleteMonthlyExchangeRateBody
    >({
      query: (deleteExchangeRateBody) => ({
        url: `/exchange`,
        method: "DELETE",
        body: deleteExchangeRateBody,
      }),
      invalidatesTags: ["exchange-rate"],
    }),
  }),
});

export const {
  useLazyGetListMonthlyExchangeRateQuery,
  useDeleteMonthlyExchangeRateMutation,
  useCreateMonthlyExchangeRateMutation,
  useUpdateMonthlyExchangeRateMutation,
  useCreateExchangeRateMutation,
} = exchangeRateAPI;

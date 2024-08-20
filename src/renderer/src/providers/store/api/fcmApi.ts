import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey } from "./type";

export interface RegisterTokenBody {
  token: string;
}

export interface DeleteTokenBody {
  token: string;
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

export const fcmApi = createApi({
  reducerPath: "fcmApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    registerFCMToken: builder.mutation<any, RegisterTokenBody>({
      query: (registerTokenBody) => ({
        url: `/fcm/register`,
        method: "POST",
        body: registerTokenBody,
      }),
    }),
    deleteFCMToken: builder.mutation<any, DeleteTokenBody>({
      query: (removeTokenBody) => ({
        url: `/fcm/remove`,
        method: "DELETE",
        body: removeTokenBody,
      }),
    }),
  }),
});

export const { useRegisterFCMTokenMutation, useDeleteFCMTokenMutation } =
  fcmApi;

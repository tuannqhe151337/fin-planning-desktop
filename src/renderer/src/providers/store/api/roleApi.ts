import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey, PaginationResponse } from "./type";

export interface Role {
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
  }
);

export const roleAPI = createApi({
  reducerPath: "roleAPI",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getListRole: builder.query<PaginationResponse<Role[]>, void>({
      query: () => {
        return `/role/user-paging-role`;
      },
    }),
  }),
});

export const { useGetListRoleQuery } = roleAPI;

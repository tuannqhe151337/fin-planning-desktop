import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey, PaginationResponse } from "./type";

export interface CreateUserBody {
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  roleId: number;
  positionId: number;
  dob: string;
  address: string;
}

export interface UpdateUserBody {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  roleId: number;
  positionId: number;
  dob: string;
  address: string;
}

export interface DeleteUserBody {
  id: string | number;
}

export interface ActivateUserBody {
  id: string | number;
}

export interface ChangePasswordUserBody {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface OTPBodyAndToken {
  otp: string;
  emailToken: string;
}

export interface ResetPasswordBodyAndToken {
  newPassword: string;
  otpToken: string;
}

export interface ListUserParameters {
  query?: string | null;
  departmentId?: number | null;
  roleId?: number | null;
  positionId?: number | null;
  page: number;
  pageSize: number;
}

export interface UserPreview {
  userId: string | number;
  username: string;
  department: Department;
  email: string;
  position: Position;
  role: Role;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail {
  userId: number | string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: Role;
  department: Department;
  address: string;
  dob: string;
  position: Position;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  code: string;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

interface TokenMessage {
  token: string;
}

// DEV ONLY!!!
// const pause = (duration: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duration);
//   });
// };

// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
// const staggeredBaseQuery = retry(
//   fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_BACKEND_HOST,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem(LocalStorageItemKey.TOKEN);
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//     fetchFn: async (...args) => {
//       // REMOVE FOR PRODUCTION
//       // await pause(1000);
//       return fetch(...args);
//     },
//   }),
//   {
//     maxRetries: 5,
//   }
// );

const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
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
  tagTypes: ["users"],
  endpoints(builder) {
    return {
      fetchUsers: builder.query<
        PaginationResponse<UserPreview[]>,
        ListUserParameters
      >({
        query: ({
          query,
          departmentId,
          roleId,
          positionId,
          page,
          pageSize,
        }) => {
          let endpoint = `user?page=${page}&size=${pageSize}`;

          if (query && query !== "") {
            endpoint += `&query=${query}`;
          }

          if (departmentId) {
            endpoint += `&departmentId=${departmentId}`;
          }

          if (roleId) {
            endpoint += `&roleId=${roleId}`;
          }

          if (positionId) {
            endpoint += `&positionId=${positionId}`;
          }

          return endpoint;
        },
        providesTags: ["users"],
      }),

      createUser: builder.mutation<any, CreateUserBody>({
        query: (createUserBody) => ({
          url: "user",
          method: "POST",
          body: createUserBody,
        }),
        invalidatesTags: ["users"],
      }),

      updateUser: builder.mutation<any, UpdateUserBody>({
        query: (updateUserBody) => ({
          url: "user",
          method: "PUT",
          body: updateUserBody,
        }),
        invalidatesTags: ["users"],
      }),

      deleteUser: builder.mutation<any, DeleteUserBody>({
        query: (deleteUserBody) => ({
          url: "user",
          method: "DELETE",
          body: deleteUserBody,
        }),
        invalidatesTags: ["users"],
      }),

      activateUser: builder.mutation<any, ActivateUserBody>({
        query: (activateUserBody) => ({
          url: "user/activate",
          method: "POST",
          body: activateUserBody,
        }),
        invalidatesTags: ["users"],
      }),

      fetchUserDetail: builder.query<UserDetail, number>({
        query: (userId) => `user/detail/${userId}`,
        providesTags: ["users"],
      }),

      changePasswordUser: builder.mutation<any, ChangePasswordUserBody>({
        query: (changePasswordUserBody) => ({
          url: "user/change-password",
          method: "POST",
          body: changePasswordUserBody,
        }),
      }),

      forgotPassword: builder.mutation<TokenMessage, ForgotPasswordBody>({
        query: (forgotPasswordBody) => ({
          url: "user/auth/forgot-password",
          method: "POST",
          body: forgotPasswordBody,
        }),
      }),

      otp: builder.mutation<TokenMessage, OTPBodyAndToken>({
        query: ({ otp, emailToken }) => ({
          url: "user/auth/otp",
          method: "POST",
          body: { otp },
          headers: {
            Authorization: emailToken,
          },
        }),
      }),

      resetPassword: builder.mutation<any, ResetPasswordBodyAndToken>({
        query: ({ newPassword, otpToken }) => ({
          url: "user/auth/reset-password",
          method: "POST",
          body: { newPassword },
          headers: {
            Authorization: otpToken,
          },
        }),
      }),
    };
  },
});

export const {
  useFetchUsersQuery,
  useLazyFetchUsersQuery,
  useCreateUserMutation,
  useFetchUserDetailQuery,
  useLazyFetchUserDetailQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useChangePasswordUserMutation,
  useForgotPasswordMutation,
  useOtpMutation,
  useResetPasswordMutation,
} = usersApi;
export { usersApi };

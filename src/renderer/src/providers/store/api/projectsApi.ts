import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { ListResponse, LocalStorageItemKey, PaginationResponse } from "./type";

export interface Project {
  projectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProjectParameters {
  query?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortType?: string;
}

export interface DeleteProjectBody {
  projectId: number;
}

export interface CreateProjectBody {
  projectName: string;
}

export interface UpdateProjectBody {
  projectId: number;
  projectName: string;
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

export const projectAPI = createApi({
  reducerPath: "projectAPI",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["projects"],
  endpoints: (builder) => ({
    getListProject: builder.query<
      PaginationResponse<Project[]>,
      ListProjectParameters
    >({
      query: ({ page, pageSize, query, sortBy, sortType }) => {
        let url = `/project/list-paginate?page=${page}&size=${pageSize}`;

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
      providesTags: ["projects"],
    }),
    getAllProject: builder.query<ListResponse<Project[]>, void>({
      query: () => ({
        url: `/project/list`,
      }),
      providesTags: ["projects"],
    }),
    createProject: builder.mutation<any, CreateProjectBody>({
      query: (createProjectBody) => ({
        url: `/project/create`,
        method: "POST",
        body: createProjectBody,
      }),
      invalidatesTags: ["projects"],
    }),
    updateProject: builder.mutation<any, UpdateProjectBody>({
      query: (updateProjectBody) => ({
        url: `/project/update`,
        method: "PUT",
        body: updateProjectBody,
      }),
      invalidatesTags: ["projects"],
    }),
    deleteProject: builder.mutation<any, DeleteProjectBody>({
      query: (deleteProjectBody) => ({
        url: `/project`,
        method: "DELETE",
        body: deleteProjectBody,
      }),
      invalidatesTags: ["projects"],
    }),
  }),
});

export const {
  useLazyGetListProjectQuery,
  useGetAllProjectQuery,
  useDeleteProjectMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectAPI;

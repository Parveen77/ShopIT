import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => `/me`,
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log(error);
        }
      },
      providesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
        url: "/me/update",
        method: "PUT",
        body,
        };
      },
      invalidatesTags: ["user"],
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
        url: "/me/upload_avatar",
        method: "PUT",
        body,
        };
      },
      invalidatesTags: ["user"],
    }),
  
  updatePassword: builder.mutation({
    query(body) {
      return {
      url: "/password/update",
      method: "PUT",
      body,
      };
    },
  }),

  forgotPassword: builder.mutation({
    query(body) {
      return {
      url: "/password/forgot",
      method: "POST",
      body,
      };
    },
  }),
  
  resetPassword: builder.mutation({
    query({token, body}) {
      return {
      url: `/password/reset/${token}`,
      method: "PUT",
      body,
      };
    },
  }),
  
  getAdminUsers: builder.query({
    query: () => `/admin/users`,
    providesTags: ["AdminUsers"],
  }),
  getUserDetails: builder.query({
    query: (id) => `/admin/user/${id}`,
    providesTags: ["AdminUser"],
  }),
  updateUser: builder.mutation({
    query({ id, body }) {
      return {
        url: `/admin/user/${id}`,
        method: "PUT",
        body,
      };
    },
    invalidatesTags: ["AdminUsers"],
  }),
  deleteUser: builder.mutation({
    query(id) {
      return {
        url: `/admin/user/${id}`,
        method: "DELETE",
      };
    },
    invalidatesTags: ["AdminUsers"],
  }),
}),
});

export const { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetAdminUsersQuery, useGetUserDetailsQuery, useDeleteUserMutation, useUpdateUserMutation } = userApi;
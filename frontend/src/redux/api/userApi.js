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
  
}),
});

export const { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation } = userApi;
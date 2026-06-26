/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IAdminDetailsDto,
  IAdminListDto,
} from "src/types/modules/users-module/adminsManagement/admins";

const editResetMessageAr = "تمّ تغيير كلمة السر بنجاح";
const editResetMessageEn = "The password has been changed successfully";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["admins"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllAdmins: query<IAdminListDto, ArgsType>({
        providesTags: ["admins"],
        query: (props) => {
          return {
            url: `${endPoints.admins().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),
      addAdmin: mutation<void, any>({
        query: (data) => ({
          url: endPoints.admins().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "admins" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      resetAdminPassword: mutation<void, any>({
        query: (data) => ({
          url: `${endPoints.admins().pathname}/reset-password`,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // showSuccessToasts(
            //   getValueBasedOnCurrentLanguage(
            //     editResetMessageAr,
            //     editResetMessageEn
            //   )
            // );
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editAdmin: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.admins().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "admins" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      activeAdmin: mutation({
        invalidatesTags: ["admins"],
        query: (id) => ({
          url: `${endPoints.admins().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getAdmin: query<IAdminDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.admins().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteAdmin: mutation({
        invalidatesTags: ["admins"],
        query: (id) => ({
          url: `${endPoints.admins().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllAdminsQuery,
  useGetAdminQuery,
  useAddAdminMutation,
  useEditAdminMutation,
  useActiveAdminMutation,
  useDeleteAdminMutation,
  useResetAdminPasswordMutation,
} = apiService;

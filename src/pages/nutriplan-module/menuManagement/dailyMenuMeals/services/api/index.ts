/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IDailyMenuMealsDetailsDto,
  IDailyMenuMealsListDto,
} from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import {
  IMenusDetailsDto,
  IMenusListDto,
} from "src/types/modules/nutriplan/menuManagement/menus";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["dailyMenuMeals"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllDailyMenuMeals: query<IDailyMenuMealsListDto, ArgsType>({
        providesTags: ["dailyMenuMeals"],
        query: (props) => {
          return {
            url: `${endPoints.dailyMenuMeals().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      addDailyMenuMeals: mutation<void, any>({
        query: (data) => ({
          url: endPoints.dailyMenuMeals().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "dailyMenuMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      addDailyMenuMealsMulti: mutation<void, any>({
        query: (data) => ({
          url: endPoints.dailyMenuMeals().pathname.concat("/meals"),
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "dailyMenuMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      createDailyMenuMultiMeals: mutation<void, any>({
        query: (data) => ({
          url: endPoints.dailyMenuMeals().pathname.concat("/multi-meals"),
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "dailyMenuMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      editDailyMenuMeals: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.dailyMenuMeals().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "dailyMenuMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      updateDefaultDailyMenuMeals: mutation<void, any>({
        query: (id) => ({
          url: `${endPoints.dailyMenuMeals().pathname}/${id}/setDefailt`,
          method: "PUT",
          data: {
            id,
          },
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "dailyMenuMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      getDailyMenuMeals: query<IDailyMenuMealsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.dailyMenuMeals().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteDailyMenuMeals: mutation({
        invalidatesTags: ["dailyMenuMeals"],
        query: (id) => ({
          url: `${endPoints.dailyMenuMeals().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddDailyMenuMealsMultiMutation,
  useAddDailyMenuMealsMutation,
  useEditDailyMenuMealsMutation,
  useDeleteDailyMenuMealsMutation,
  useGetDailyMenuMealsQuery,
  useUpdateDefaultDailyMenuMealsMutation,
  useGetAllDailyMenuMealsQuery,
  useCreateDailyMenuMultiMealsMutation,
} = apiService;

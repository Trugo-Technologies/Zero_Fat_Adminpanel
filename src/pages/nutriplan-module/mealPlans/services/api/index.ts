/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";

import { serialize } from "object-to-formdata";
import {
  IMealPlans,
  IMealPlansDetailsDto,
  IMealPlansListDto,
} from "src/types/modules/nutriplan/mealPlans";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workouts"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMealPlans: query<IMealPlansListDto, ArgsType>({
        providesTags: ["mealPlans"],
        query: (props) => {
          return {
            url: `${endPoints.mealPlans().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),

      addMealPlans: mutation<void, any>({
        query: (data) => ({
          url: endPoints.mealPlans().pathname,
          method: "POST",
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "mealPlans" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editMealPlans: mutation<void, any>({
        // invalidatesTags: ['workouts'],

        query: ({ data, id }) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
          method: "PUT",
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
        }),

        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "mealPlans" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveMealPlans: mutation({
        invalidatesTags: ["mealPlans"],
        query: (id) => ({
          url: `${endPoints.mealPlans().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      getMealPlan: query<IMealPlansDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMealPlan: mutation({
        invalidatesTags: ["mealPlans"],
        query: (id) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllMealPlansQuery,
  useGetMealPlanQuery,
  useAddMealPlansMutation,
  useEditMealPlansMutation,
  useDeleteMealPlanMutation,
  useUpdateActiveMealPlansMutation,
} = apiService;

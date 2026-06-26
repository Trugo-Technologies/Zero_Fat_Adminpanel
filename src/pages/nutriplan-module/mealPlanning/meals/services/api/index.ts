/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";

import {
  IMealsDetailsDto,
  IMealsListDto,
} from "src/types/modules/nutriplan/mealPlanning/meals";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["meals"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMeals: query<IMealsListDto, ArgsType>({
        providesTags: ["meals"],
        query: (props) => {
          return {
            url: `${endPoints.meals().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addMeal: mutation<void, any>({
        query: (data) => ({
          url: endPoints.meals().pathname,
          method: "POST",

          data: serialize(
            { ...data },
            {
              noAttributesWithArrayNotation: false,
              dotsForObjectNotation: false,
              noFilesWithArrayNotation: false,
              allowEmptyArrays: false,
              indices: true,
            }
          ),
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "meals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );

            throw error;
          }
        },
      }),
      editMeal: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.meals().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "meals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveMeal: mutation({
        invalidatesTags: ["meals"],
        query: (id) => ({
          url: `${endPoints.meals().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getMeal: query<IMealsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.meals().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMeal: mutation({
        invalidatesTags: ["meals"],
        query: (id) => ({
          url: `${endPoints.meals().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddMealMutation,
  useEditMealMutation,
  useDeleteMealMutation,
  useGetAllMealsQuery,
  useGetMealQuery,
  useUpdateActiveMealMutation,
} = apiService;

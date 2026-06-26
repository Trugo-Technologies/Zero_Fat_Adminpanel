/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IMealTypesListDto,
  IMealTypesDetailsDto,
} from "src/types/modules/nutriplan/mealTypes";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["MealTypes"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMealTypes: query<IMealTypesListDto, ArgsType>({
        providesTags: ["MealTypes"],
        query: (props) => {
          return {
            url: `${endPoints.mealTypes().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addMealType: mutation<void, any>({
        query: (data) => ({
          url: endPoints.mealTypes().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "MealTypes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editMealType: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.mealTypes().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "MealTypes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveMealType: mutation({
        invalidatesTags: ["MealTypes"],
        query: (id) => ({
          url: `${endPoints.mealTypes().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getMealType: query<IMealTypesDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.mealTypes().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMealType: mutation({
        invalidatesTags: ["MealTypes"],
        query: (id) => ({
          url: `${endPoints.mealTypes().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllMealTypesQuery,
  useGetMealTypeQuery,
  useDeleteMealTypeMutation,
  useEditMealTypeMutation,
  useAddMealTypeMutation,
  useUpdateActiveMealTypeMutation,
} = apiService;

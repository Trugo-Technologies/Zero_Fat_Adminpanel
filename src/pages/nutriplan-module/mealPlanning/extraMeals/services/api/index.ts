/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IExtraMeal,
  IExtraMealsDetailsDto,
  IExtraMealsListDto,
} from "src/types/modules/nutriplan/extras";

import {
  IMealsDetailsDto,
  IMealsListDto,
} from "src/types/modules/nutriplan/mealPlanning/meals";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["extraMeals"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllExtraMeals: query<IExtraMealsListDto, ArgsType>({
        providesTags: ["extraMeals"],
        query: (props) => {
          return {
            url: `${endPoints.extrasMeals().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addExtraMeal: mutation<void, any>({
        query: (data) => ({
          url: endPoints.extrasMeals().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "extraMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );

            throw error;
          }
        },
      }),
      editExtraMeal: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.extrasMeals().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "extraMeals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      getExtraMeal: query<IExtraMealsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.extrasMeals().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteExtraMeal: mutation({
        invalidatesTags: ["extraMeals"],
        query: (id) => ({
          url: `${endPoints.extrasMeals().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddExtraMealMutation,
  useEditExtraMealMutation,
  useDeleteExtraMealMutation,
  useGetAllExtraMealsQuery,
  useGetExtraMealQuery,
} = apiService;

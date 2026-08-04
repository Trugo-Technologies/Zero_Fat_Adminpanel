/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";

import {
  IIngredientsDetailsDto,
  IIngredientsListDto,
} from "src/types/modules/nutriplan/mealPlanning/ingredients";
import { buildIngredientsFilterRequest } from "../../ingredientFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["Ingredients"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query, mutation }) => ({
      getAllIngredients: query<IIngredientsListDto, ArgsType>({
        providesTags: ["Ingredients"],
        query: (props) => ({
          url: `${endPoints.ingredients().pathname}/filter`,
          method: "GET",
          params: buildIngredientsFilterRequest(props),
        }),
      }),
      // addIngredients: mutation<void, any>({
      //   invalidatesTags: ['Ingredients'],
      //   query: (data) => ({
      //     url: endPoints.ingredients().pathname,
      //     method: 'POST',
      //     data,
      //   }),
      // }),

      addIngredients: mutation<void, any>({
        query: (data) => ({
          url: endPoints.ingredients().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "Ingredients" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      // editIngredients: mutation<void, any>({
      //   invalidatesTags: ['Ingredients'],

      //   query: ({ data, id }) => ({
      //     url: `${endPoints.ingredients().pathname}/${id}`,
      //     method: 'PUT',
      //     data,
      //   }),
      // }),

      editIngredients: mutation<void, any>({
        // invalidatesTags: ['workouts'],

        query: ({ data, id }) => ({
          url: `${endPoints.ingredients().pathname}/${id}`,
          method: "PUT",
          data,
        }),

        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "Ingredients" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveIngredients: mutation({
        invalidatesTags: ["Ingredients"],
        query: (id) => ({
          url: `${endPoints.ingredients().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getIngredients: query<IIngredientsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.ingredients().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteIngredients: mutation({
        invalidatesTags: ["Ingredients"],
        query: (id) => ({
          url: `${endPoints.ingredients().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
      deleteAllIngredients: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.ingredients().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "Ingredients" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
    }),
  });
export const {
  useGetAllIngredientsQuery,
  useGetIngredientsQuery,
  useDeleteIngredientsMutation,
  useEditIngredientsMutation,
  useAddIngredientsMutation,
  useUpdateActiveIngredientsMutation,
  useDeleteAllIngredientsMutation,
} = apiService;

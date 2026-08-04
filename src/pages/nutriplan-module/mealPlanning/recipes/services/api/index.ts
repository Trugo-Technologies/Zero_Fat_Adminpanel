/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";

import {
  IIngredientsDetailsDto,
  IIngredientsListDto,
} from "src/types/modules/nutriplan/mealPlanning/ingredients";
import {
  IRecipesDetailsDto,
  IRecipesListDto,
} from "src/types/modules/nutriplan/mealPlanning/recipes";
import { buildRecipesFilterRequest } from "../../recipeFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["recipes"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query, mutation }) => ({
      getAllRecipes: query<IRecipesListDto, ArgsType>({
        providesTags: ["recipes"],
        query: (props) => ({
          url: `${endPoints.recipes().pathname}/filter`,
          method: "GET",
          params: buildRecipesFilterRequest(props),
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

      addRecipes: mutation<void, any>({
        query: (data) => ({
          url: endPoints.recipes().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "recipes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      editRecipeImage: mutation<void, any>({
        query: (data) => ({
          url: endPoints.recipes().pathname.concat("/image"),
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "recipes" }])); // Correct format
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

      editRecipes: mutation<void, any>({
        // invalidatesTags: ['workouts'],

        query: ({ data, id }) => ({
          url: `${endPoints.recipes().pathname}/${id}`,
          method: "PUT",
          data,
        }),

        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "recipes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveRecipes: mutation({
        invalidatesTags: ["recipes"],
        query: (id) => ({
          url: `${endPoints.recipes().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getRecipes: query<IRecipesDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.recipes().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteRecipes: mutation({
        invalidatesTags: ["recipes"],
        query: (id) => ({
          url: `${endPoints.recipes().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddRecipesMutation,
  useEditRecipesMutation,
  useDeleteRecipesMutation,
  useGetRecipesQuery,
  useGetAllRecipesQuery,
  useEditRecipeImageMutation,
} = apiService;

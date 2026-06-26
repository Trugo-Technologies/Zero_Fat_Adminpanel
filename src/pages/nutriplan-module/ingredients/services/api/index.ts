/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IIngredientsDetailsDto } from "src/types/modules/nutriplan/mealPlanning/ingredients";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["Ingredients"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllIngredients: query<any, ArgsType>({
        providesTags: ["Ingredients"],
        query: (props) => {
          return {
            url: `${endPoints.ingredients().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addIngredients: mutation<void, any>({
        invalidatesTags: ["Ingredients"],
        query: (data) => ({
          url: endPoints.ingredients().pathname,
          method: "POST",
          data,
        }),
      }),
      editIngredients: mutation<void, any>({
        invalidatesTags: ["Ingredients"],

        query: ({ data, id }) => ({
          url: `${endPoints.ingredients().pathname}/${id}`,
          method: "PUT",
          data,
        }),
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
    }),
  });
export const {
  useGetAllIngredientsQuery,
  useGetIngredientsQuery,
  useDeleteIngredientsMutation,
  useEditIngredientsMutation,
  useAddIngredientsMutation,
  useUpdateActiveIngredientsMutation,
} = apiService;

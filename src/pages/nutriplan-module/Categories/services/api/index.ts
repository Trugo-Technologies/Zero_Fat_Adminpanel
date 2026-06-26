/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  ICategoriesDetailsDto,
  ICategoriesListDto,
} from "src/types/modules/nutriplan/categories";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["categories"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCategories: query<ICategoriesListDto, ArgsType>({
        providesTags: ["categories"],
        query: (props) => {
          return {
            url: `${endPoints.categories().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addCategory: mutation<void, any>({
        query: (data) => ({
          url: endPoints.categories().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "categories" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editCategory: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.categories().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "categories" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveCategory: mutation({
        invalidatesTags: ["categories"],
        query: (id) => ({
          url: `${endPoints.categories().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getCategory: query<ICategoriesDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.categories().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteCategory: mutation({
        invalidatesTags: ["categories"],
        query: (id) => ({
          url: `${endPoints.categories().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useAddCategoryMutation,
  useUpdateActiveCategoryMutation,
} = apiService;

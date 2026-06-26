/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IFaqCategoriesDetails,
  IFaqCategoriesListDto,
} from "src/types/modules/core/faqCategories";

const service = api
  .enhanceEndpoints({ addTagTypes: ["FaqCategories"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllFaqCategories: query<IFaqCategoriesListDto, ArgsType>({
        providesTags: ["FaqCategories"],
        query: (data) => ({
          url: endPoints.faqCategoriesEndpoint().pathname + "/search",
          data,
          method: "POST",
        }),
      }),
      createFaqCategories: mutation({
        invalidatesTags: ["FaqCategories"],
        query: (data) => ({
          url: endPoints.faqCategoriesEndpoint().pathname,
          data,
          method: "POST",
        }),
      }),
      editFaqCategories: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.faqCategoriesEndpoint().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "FaqCategories" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveFaqCategories: mutation({
        invalidatesTags: ["FaqCategories"],
        query: (id) => ({
          url: `${endPoints.faqCategoriesEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      getFaqCategory: query<IFaqCategoriesDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.faqCategoriesEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteFaqCategory: mutation({
        invalidatesTags: ["FaqCategories"],

        query: (id) => ({
          url: endPoints.faqCategoriesEndpoint().pathname + `/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useCreateFaqCategoriesMutation,
  useDeleteFaqCategoryMutation,
  useGetAllFaqCategoriesQuery,
  useUpdateActiveFaqCategoriesMutation,
  useEditFaqCategoriesMutation,
  useGetFaqCategoryQuery,
} = service;

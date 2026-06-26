/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IDiscountRuleDetailsDto,
  IDiscountRulesListDto,
} from "src/types/modules/clientsManagement/discounts/discountRules";

const TAG_NAME = "discountRules";
const discountRulesService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllDiscountRules: query<IDiscountRulesListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.discountRules().pathname + "/search",
          data,
          method: "POST",
        }),
      }),
      createDiscountRule: mutation({
        invalidatesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.discountRules().pathname,
          data,
          method: "POST",
        }),
      }),

      publishDiscountRule: mutation({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.discountRules().pathname}/publish/${id}`,
          method: "POST",
        }),
      }),

      updateActiveDiscountRule: mutation({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.discountRules().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      getDiscountRuleById: query<IDiscountRuleDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.discountRules().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      updateDiscountRule: mutation({
        invalidatesTags: [TAG_NAME],
        query: ({ id, data, isActive }) => ({
          url: `${endPoints.discountRules().pathname}/${isActive ? "active/" : ""}${id}`,
          data,
          method: "PUT",
        }),
      }),
      deleteDiscountRule: mutation({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.discountRules().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllDiscountRules: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.discountRules().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: TAG_NAME }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllDiscountRules: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.discountRules().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: TAG_NAME }])); // Correct format
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
  useGetAllDiscountRulesQuery,
  useCreateDiscountRuleMutation,
  useDeleteDiscountRuleMutation,
  useGetDiscountRuleByIdQuery,
  useUpdateDiscountRuleMutation,
  useDeleteAllDiscountRulesMutation,
  useActiveAllDiscountRulesMutation,
  useUpdateActiveDiscountRuleMutation,
  usePublishDiscountRuleMutation,
} = discountRulesService;

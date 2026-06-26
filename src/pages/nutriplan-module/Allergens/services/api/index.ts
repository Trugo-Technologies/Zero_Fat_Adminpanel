/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IAllergensListDto,
  IAllergensDetailsDto,
} from "src/types/modules/nutriplan/allergens";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["Allergens"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllAllergens: query<IAllergensListDto, ArgsType>({
        providesTags: ["Allergens"],
        query: (props) => {
          return {
            url: `${endPoints.allergens().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addAllergens: mutation<void, any>({
        query: (data) => ({
          url: endPoints.allergens().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "Allergens" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      // addAllergens: mutation<void, any>({
      //   query: (data) => ({
      //     url: endPoints.allergens().pathname,
      //     method: 'POST',
      //     data,
      //   }),
      //   invalidatesTags: ['Allergens'],
      // }),
      editAllergens: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.allergens().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "Allergens" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveAllergens: mutation({
        invalidatesTags: ["Allergens"],
        query: (id) => ({
          url: `${endPoints.allergens().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getAllergens: query<IAllergensDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.allergens().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteAllergens: mutation({
        invalidatesTags: ["Allergens"],
        query: (id) => ({
          url: `${endPoints.allergens().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllAllergensQuery,
  useGetAllergensQuery,
  useDeleteAllergensMutation,
  useEditAllergensMutation,
  useAddAllergensMutation,
  useUpdateActiveAllergensMutation,
} = apiService;

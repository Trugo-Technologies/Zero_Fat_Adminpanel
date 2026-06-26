/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IAdvertisementsDetailsDto,
  IAdvertisementsListDto,
} from "src/types/modules/core/advertisements";

const service = api
  .enhanceEndpoints({ addTagTypes: ["advertisements"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllAdvertisements: query<IAdvertisementsListDto, ArgsType>({
        providesTags: ["advertisements"],
        query: (data) => ({
          url: endPoints.advertisementsEndpoint().pathname + "/search",
          method: "POST",
          data,
        }),
      }),

      addAdvertisements: mutation<void, any>({
        query: (data) => ({
          url: endPoints.advertisementsEndpoint().pathname,
          method: "POST",

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
            dispatch(api.util.invalidateTags([{ type: "advertisements" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      updateAdvertisements: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.advertisementsEndpoint().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "advertisements" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      updateActiveAdvertisements: mutation({
        invalidatesTags: ["advertisements"],
        query: (id) => ({
          url: `${endPoints.advertisementsEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      deleteAdvertisements: mutation({
        invalidatesTags: ["advertisements"],

        query: (id) => ({
          url: endPoints.advertisementsEndpoint().pathname + `/${id}`,
          method: "DELETE",
        }),
      }),

      getAdvertisements: query<IAdvertisementsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.advertisementsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useDeleteAdvertisementsMutation,
  useGetAdvertisementsQuery,
  useGetAllAdvertisementsQuery,
  useUpdateAdvertisementsMutation,
  useAddAdvertisementsMutation,
  useUpdateActiveAdvertisementsMutation,
} = service;

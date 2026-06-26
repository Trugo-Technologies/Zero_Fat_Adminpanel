/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IPhysicalActivityLevelsDetailsDto,
  IPhysicalActivityLevelsListDto,
} from "src/types/modules/core/physicalActivityLevels";

const service = api
  .enhanceEndpoints({ addTagTypes: ["physicalActivityLevels"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllPhysicalActivityLevels: query<
        IPhysicalActivityLevelsListDto,
        ArgsType
      >({
        providesTags: ["physicalActivityLevels"],
        query: (data) => ({
          url: endPoints.physicalActivityLevelsEndpoint().pathname + "/search",
          method: "POST",
          data,
        }),
      }),

      addPhysicalActivityLevels: mutation<void, any>({
        query: (data) => ({
          url: endPoints.physicalActivityLevelsEndpoint().pathname,
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
            dispatch(
              api.util.invalidateTags([{ type: "physicalActivityLevels" }])
            ); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      editPhysicalActivityLevels: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.physicalActivityLevelsEndpoint().pathname}/${id}`,
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
            dispatch(
              api.util.invalidateTags([{ type: "physicalActivityLevels" }])
            ); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      updateActivePhysicalActivityLevel: mutation({
        invalidatesTags: ["physicalActivityLevels"],
        query: (id) => ({
          url: `${endPoints.physicalActivityLevelsEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      deletePhysicalActivityLevels: mutation({
        invalidatesTags: ["physicalActivityLevels"],

        query: (id) => ({
          url: endPoints.physicalActivityLevelsEndpoint().pathname + `/${id}`,
          method: "DELETE",
        }),
      }),

      getPhysicalActivityLevels: query<
        IPhysicalActivityLevelsDetailsDto,
        ArgsType
      >({
        query: ({ id }) => ({
          url: `${endPoints.physicalActivityLevelsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useAddPhysicalActivityLevelsMutation,
  useDeletePhysicalActivityLevelsMutation,
  useEditPhysicalActivityLevelsMutation,
  useGetAllPhysicalActivityLevelsQuery,
  useGetPhysicalActivityLevelsQuery,
  useUpdateActivePhysicalActivityLevelMutation,
} = service;

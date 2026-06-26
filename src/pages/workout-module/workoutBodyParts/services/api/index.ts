/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IWorkoutBodyPartDetailsDto,
  IWorkoutBodyPartsListDto,
} from "src/types/modules/workout/workoutBodyParts";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workoutBodyParts"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllWorkoutBodyParts: query<IWorkoutBodyPartsListDto, ArgsType>({
        providesTags: ["workoutBodyParts"],
        query: (props) => {
          return {
            url: `${endPoints.workoutBodyParts().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),

      addWorkoutBodyParts: mutation<void, any>({
        query: (data) => ({
          url: endPoints.workoutBodyParts().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutBodyParts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editWorkoutBodyParts: mutation<void, any>({
        // invalidatesTags: ['workoutBodyParts'],

        query: ({ data, id }) => ({
          url: `${endPoints.workoutBodyParts().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutBodyParts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveBodyParts: mutation({
        invalidatesTags: ["workoutBodyParts"],
        query: (id) => ({
          url: `${endPoints.workoutBodyParts().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getBodyPart: query<IWorkoutBodyPartDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.workoutBodyParts().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),

      deleteBodyParts: mutation({
        invalidatesTags: ["workoutBodyParts"],
        query: (id) => ({
          url: `${endPoints.workoutBodyParts().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllBodyParts: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.workoutBodyParts().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutBodyParts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllBodyParts: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.workoutBodyParts().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutBodyParts" }])); // Correct format
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
  useGetAllWorkoutBodyPartsQuery,
  useGetBodyPartQuery,
  useDeleteBodyPartsMutation,
  useEditWorkoutBodyPartsMutation,
  useAddWorkoutBodyPartsMutation,
  useUpdateActiveBodyPartsMutation,
  useDeleteAllBodyPartsMutation,
  useActiveAllBodyPartsMutation,
} = apiService;

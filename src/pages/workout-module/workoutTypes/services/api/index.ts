/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IWorkoutTypeDetailsDto,
  IWorkoutTypesListDto,
} from "src/types/modules/workout/workoutTypes";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workoutTypes"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllWorkoutTypes: query<IWorkoutTypesListDto, ArgsType>({
        providesTags: ["workoutTypes"],
        query: (props) => {
          return {
            url: `${endPoints.workoutTypes().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      addWorkoutTypes: mutation<void, any>({
        query: (data) => ({
          url: endPoints.workoutTypes().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutTypes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editWorkoutTypes: mutation<void, any>({
        // invalidatesTags: ['workoutTypes'],

        query: ({ data, id }) => ({
          url: `${endPoints.workoutTypes().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutTypes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveWorkoutTypes: mutation({
        invalidatesTags: ["workoutTypes"],
        query: (id) => ({
          url: `${endPoints.workoutTypes().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getWorkoutTypes: query<IWorkoutTypeDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.workoutTypes().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteWorkoutTypes: mutation({
        invalidatesTags: ["workoutTypes"],
        query: (id) => ({
          url: `${endPoints.workoutTypes().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
      deleteAllWorkoutTypes: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.workoutTypes().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutTypes" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllWorkoutTypes: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.workoutTypes().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutTypes" }])); // Correct format
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
  useGetAllWorkoutTypesQuery,
  useGetWorkoutTypesQuery,
  useAddWorkoutTypesMutation,
  useEditWorkoutTypesMutation,
  useDeleteWorkoutTypesMutation,
  useUpdateActiveWorkoutTypesMutation,
  useDeleteAllWorkoutTypesMutation,
  useActiveAllWorkoutTypesMutation,
} = apiService;

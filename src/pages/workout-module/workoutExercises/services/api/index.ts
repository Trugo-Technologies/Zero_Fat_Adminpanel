/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IWorkoutExerciseDetailsDto,
  IWorkoutExercisesListDto,
} from "src/types/modules/workout/workoutExercises";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workoutExercises"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllWorkoutExercises: query<IWorkoutExercisesListDto, ArgsType>({
        providesTags: ["workoutExercises"],
        query: (props) => {
          return {
            url: `${endPoints.workoutExercises().pathname}/search`,
            method: "POST",
            params: {},
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),

      addWorkoutExercise: mutation<void, any>({
        query: (data) => ({
          url: endPoints.workoutExercises().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutExercises" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editWorkoutExercise: mutation<void, any>({
        // invalidatesTags: ['workoutExercises'],

        query: ({ data, id }) => ({
          url: `${endPoints.workoutExercises().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workoutExercises" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveWorkoutExercise: mutation({
        invalidatesTags: ["workoutExercises"],
        query: (id) => ({
          url: `${endPoints.workoutExercises().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getWorkoutExercise: query<IWorkoutExerciseDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.workoutExercises().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteWorkoutExercise: mutation({
        invalidatesTags: ["workoutExercises"],
        query: (id) => ({
          url: `${endPoints.workoutExercises().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllWorkoutExercisesQuery,
  useGetWorkoutExerciseQuery,
  useAddWorkoutExerciseMutation,
  useEditWorkoutExerciseMutation,
  useDeleteWorkoutExerciseMutation,
  useUpdateActiveWorkoutExerciseMutation,
} = apiService;

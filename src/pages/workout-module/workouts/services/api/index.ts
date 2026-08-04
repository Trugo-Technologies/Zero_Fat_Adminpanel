/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IWorkoutDetailsDto,
  IWorkoutsListDto,
} from "src/types/modules/workout/workouts";
import { buildWorkoutsSearchRequest } from "../../workoutFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workouts"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllWorkouts: query<IWorkoutsListDto, ArgsType>({
        providesTags: ["workouts"],
        query: (props) => {
          return {
            url: `${endPoints.workouts().pathname}/search`,
            method: "POST",
            data: buildWorkoutsSearchRequest(props),
          };
        },
        keepUnusedDataFor: 0,
      }),

      addWorkout: mutation<void, any>({
        query: (data) => ({
          url: endPoints.workouts().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "workouts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editWorkout: mutation<void, any>({
        // invalidatesTags: ['workouts'],

        query: ({ data, id }) => ({
          url: `${endPoints.workouts().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "workouts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveWorkout: mutation({
        invalidatesTags: ["workouts"],
        query: (id) => ({
          url: `${endPoints.workouts().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      updateToggleTopWorkout: mutation({
        invalidatesTags: ["workouts"],
        query: (id) => ({
          url: `${endPoints.workouts().pathname}/topWorkout/${id}`,
          method: "PUT",
        }),
      }),

      updateToggleWorkoutOfTheDay: mutation({
        invalidatesTags: ["workouts"],
        query: (id) => ({
          url: `${endPoints.workouts().pathname}/workoutOfTheDay/${id}`,
          method: "PUT",
        }),
      }),

      getWorkout: query<IWorkoutDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.workouts().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteWorkout: mutation({
        invalidatesTags: ["workouts"],
        query: (id) => ({
          url: `${endPoints.workouts().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllWorkouts: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.workouts().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workouts" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllWorkouts: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.workouts().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "workouts" }])); // Correct format
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
  useGetAllWorkoutsQuery,
  useGetWorkoutQuery,
  useAddWorkoutMutation,
  useEditWorkoutMutation,
  useDeleteWorkoutMutation,
  useUpdateActiveWorkoutMutation,
  useUpdateToggleTopWorkoutMutation,
  useUpdateToggleWorkoutOfTheDayMutation,
  useDeleteAllWorkoutsMutation,
  useActiveAllWorkoutsMutation,
} = apiService;

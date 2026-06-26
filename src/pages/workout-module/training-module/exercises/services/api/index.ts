/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IExerciseDetailsDto,
  IExercisesListDto,
} from "src/types/modules/training/exercises";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["exercises"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllExercises: query<IExercisesListDto, ArgsType>({
        providesTags: ["exercises"],
        query: (props) => {
          return {
            url: `${endPoints.exercises().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),
      addExercise: mutation<void, any>({
        query: (data) => ({
          url: endPoints.exercises().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "exercises" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editExercise: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.exercises().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "exercises" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      activeExercise: mutation({
        invalidatesTags: ["exercises"],
        query: (id) => ({
          url: `${endPoints.exercises().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getExercise: query<IExerciseDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.exercises().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteExercise: mutation({
        invalidatesTags: ["exercises"],
        query: (id) => ({
          url: `${endPoints.exercises().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllExercises: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.exercises().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "exercises" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllExercises: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.exercises().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "exercises" }])); // Correct format
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
  useGetAllExercisesQuery,
  useGetExerciseQuery,
  useAddExerciseMutation,
  useEditExerciseMutation,
  useActiveExerciseMutation,
  useDeleteExerciseMutation,
  useDeleteAllExercisesMutation,
  useActiveAllExercisesMutation,
} = apiService;

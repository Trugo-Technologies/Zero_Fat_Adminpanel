/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  ITrainerDetailsDto,
  ITrainersListDto,
} from "src/types/modules/training/trainers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["trainers"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllTrainers: query<ITrainersListDto, ArgsType>({
        providesTags: ["trainers"],
        query: (props) => {
          return {
            url: `${endPoints.trainers().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),
      addTrainer: mutation<void, any>({
        query: (data) => ({
          url: endPoints.trainers().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "trainers" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editTrainer: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.trainers().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "trainers" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      activeTrainer: mutation({
        invalidatesTags: ["trainers"],
        query: (id) => ({
          url: `${endPoints.trainers().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getTrainer: query<ITrainerDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.trainers().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteTrainer: mutation({
        invalidatesTags: ["trainers"],
        query: (id) => ({
          url: `${endPoints.trainers().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
      deleteAllTrainers: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.trainers().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "trainers" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllTrainers: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.trainers().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "trainers" }])); // Correct format
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
  useGetAllTrainersQuery,
  useGetTrainerQuery,
  useAddTrainerMutation,
  useEditTrainerMutation,
  useActiveTrainerMutation,
  useDeleteTrainerMutation,
  useDeleteAllTrainersMutation,
  useActiveAllTrainersMutation,
} = apiService;

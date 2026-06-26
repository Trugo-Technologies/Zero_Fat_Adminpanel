/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IPlanScheduleDetailsDto,
  IPlanSchedulesListDto,
} from "src/types/modules/workout/planSchedules";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["PlanSchedules"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPlanSchedules: query<IPlanSchedulesListDto, ArgsType>({
        providesTags: ["PlanSchedules"],
        query: (props) => {
          return {
            url: `${endPoints.planSchedules().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      addPlanSchedule: mutation<void, any>({
        query: (data) => ({
          url: endPoints.planSchedules().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanSchedules" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editPlanSchedule: mutation<void, any>({
        // invalidatesTags: ['PlanSchedules'],

        query: ({ data, id }) => ({
          url: `${endPoints.planSchedules().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanSchedules" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      getPlanSchedule: query<IPlanScheduleDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.planSchedules().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deletePlanSchedule: mutation({
        invalidatesTags: ["PlanSchedules"],
        query: (id) => ({
          url: `${endPoints.planSchedules().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllPlanSchedulesQuery,
  useGetPlanScheduleQuery,
  useAddPlanScheduleMutation,
  useEditPlanScheduleMutation,
  useDeletePlanScheduleMutation,
} = apiService;

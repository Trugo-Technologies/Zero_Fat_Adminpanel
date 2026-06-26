/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IPlanGoalDetailsDto,
  IPlanGoalsListDto,
} from "src/types/modules/workout/planGoals";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["PlanGoals"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPlanGoals: query<IPlanGoalsListDto, ArgsType>({
        providesTags: ["PlanGoals"],
        query: (props) => {
          return {
            url: `${endPoints.planGoals().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      addPlanGoal: mutation<void, any>({
        query: (data) => ({
          url: endPoints.planGoals().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanGoals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editPlanGoal: mutation<void, any>({
        // invalidatesTags: ['PlanGoals'],

        query: ({ data, id }) => ({
          url: `${endPoints.planGoals().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanGoals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActivePlanGoal: mutation({
        invalidatesTags: ["PlanGoals"],
        query: (id) => ({
          url: `${endPoints.planGoals().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getPlanGoal: query<IPlanGoalDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.planGoals().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deletePlanGoal: mutation({
        invalidatesTags: ["PlanGoals"],
        query: (id) => ({
          url: `${endPoints.planGoals().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllPlanGoals: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.planGoals().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanGoals" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllPlanGoals: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.planGoals().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "PlanGoals" }])); // Correct format
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
  useGetAllPlanGoalsQuery,
  useGetPlanGoalQuery,
  useAddPlanGoalMutation,
  useEditPlanGoalMutation,
  useUpdateActivePlanGoalMutation,
  useDeletePlanGoalMutation,
  useDeleteAllPlanGoalsMutation,
  useActiveAllPlanGoalsMutation,
} = apiService;

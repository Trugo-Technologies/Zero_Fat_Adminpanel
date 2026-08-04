/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IWorkoutPlansDetailsDto,
  IWorkoutPlansListDto,
} from "src/types/modules/workout/workoutPlans";
import { buildPlansSearchRequest } from "../../planFilterHelpers";

const workoutPlansService = api
  .enhanceEndpoints({ addTagTypes: ["plans"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllPlans: query<IWorkoutPlansListDto, ArgsType>({
        providesTags: ["plans"],
        query: (data) => ({
          url: endPoints.planEndpoint().pathname + "/search",
          data: buildPlansSearchRequest(data),
          method: "POST",
        }),
      }),
      createPlan: mutation({
        invalidatesTags: ["plans"],
        query: (data) => ({
          url: endPoints.planEndpoint().pathname,
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
          method: "POST",
        }),
      }),

      getPlanById: query<IWorkoutPlansDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.planEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      updatePlan: mutation({
        invalidatesTags: ["plans"],
        query: ({ id, data, isActive }) => ({
          url: `${endPoints.planEndpoint().pathname}/${isActive ? "active/" : ""}${id}`,
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
          method: "PUT",
        }),
      }),
      deletePlan: mutation({
        invalidatesTags: ["plans"],
        query: (id) => ({
          url: `${endPoints.planEndpoint().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
      // TODO to remove when main feature added
      getTrainerOptions: query({
        query: () => ({
          url: endPoints.trainerEndpoint().pathname + "/search",
          method: "POST",
          data: {},
        }),
      }),
      // TODO to remove when main feature added
      getPlanGoalsOptions: query({
        query: () => ({
          url: endPoints.planGoalsEndpoint().pathname + "/search",
          method: "POST",
          data: {},
        }),
      }),

      deleteAllPlans: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.planEndpoint().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "plans" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllPlans: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.planEndpoint().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "plans" }])); // Correct format
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
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useDeletePlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
  useGetPlanGoalsOptionsQuery,
  useGetTrainerOptionsQuery,
  useDeleteAllPlansMutation,
  useActiveAllPlansMutation,
} = workoutPlansService;

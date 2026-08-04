/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse, IBaseResponseDetailsDto } from "src/types/baseEntity";
import { MealPlanExportFilters, buildMealPlanExportParams, buildMealPlansSearchRequest } from "../../mealPlanFilterHelpers";

import { serialize } from "object-to-formdata";
import {
  IMealPlans,
  IMealPlansDetailsDto,
  IMealPlansListDto,
} from "src/types/modules/nutriplan/mealPlans";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workouts"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMealPlans: query<IMealPlansListDto, ArgsType>({
        providesTags: ["mealPlans"],
        query: (props) => {
          return {
            url: `${endPoints.mealPlans().pathname}/search`,
            method: "POST",
            data: buildMealPlansSearchRequest(props),
          };
        },
        keepUnusedDataFor: 0,
      }),

      getActiveMealPlans: query<IBaseResponseDetailsDto<IMealPlans[]>, void>({
        providesTags: ["mealPlans"],
        query: () => ({
          url: endPoints.mealPlans().pathname,
          method: "GET",
          params: { isActive: true },
        }),
        keepUnusedDataFor: 0,
      }),

      addMealPlans: mutation<void, any>({
        query: (data) => ({
          url: endPoints.mealPlans().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "mealPlans" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editMealPlans: mutation<void, any>({
        // invalidatesTags: ['workouts'],

        query: ({ data, id }) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "mealPlans" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveMealPlans: mutation({
        invalidatesTags: ["mealPlans"],
        query: (id) => ({
          url: `${endPoints.mealPlans().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      getMealPlan: query<IMealPlansDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMealPlan: mutation({
        invalidatesTags: ["mealPlans"],
        query: (id) => ({
          url: `${endPoints.mealPlans().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
      exportMealPlans: mutation<void, MealPlanExportFilters>({
        queryFn: async (filters) => {
          try {
            await downloadAuthenticatedFile({
              path: `${endPoints.mealPlans().pathname}/export`,
              params: buildMealPlanExportParams(filters),
              defaultFilename: "meal-plans.xlsx",
              forceExtension: "xlsx",
            });

            return { data: undefined };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Download failed";
            showErrorToasts(message);
            return {
              error: {
                status: "FETCH_ERROR",
                error: message,
              },
            };
          }
        },
      }),
    }),
  });
export const {
  useGetAllMealPlansQuery,
  useGetActiveMealPlansQuery,
  useGetMealPlanQuery,
  useAddMealPlansMutation,
  useEditMealPlansMutation,
  useDeleteMealPlanMutation,
  useUpdateActiveMealPlansMutation,
  useExportMealPlansMutation,
} = apiService;

/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { getApiErrorMessage } from "src/Helpers/get-api-error-message";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IClientAccountAccessDetails,
  IBlockClientAccountAccessPayload,
  IClientAccountActivityLogsArgs,
  IClientAccountActivityLogsListDto,
  IDeliveryCalendarCutoffSettingsDetails,
  IDeliveryCalendarDetails,
  IDeliveryCalendarArgs,
  IDeliveryCalendarDayDetails,
  IDeliveryCalendarDayArgs,
  IChangeDeliveryCalendarPaymentMethodPayload,
  ICancelDeliveryCalendarPayload,
  IMoveDeliveryCalendarPayload,
  IPauseDeliveryCalendarPayload,
  IResumeDeliveryCalendarPayload,
  IDeliveryCalendarPauseStatusDetails,
  IAddDeliveryCalendarItemsPayload,
  IPreviewAddDeliveryCalendarItemsPayload,
  IChangeDeliveryCalendarMealPlanPayload,
  IPreviewChangeDeliveryCalendarMealPlanPayload,
  IReplaceDeliveryCalendarMealsPayload,
  IPreviewReplaceDeliveryCalendarMealsPayload,
  IReplaceDeliveryCalendarMealsPreviewDetails,
  IDeliveryCalendarActionPreviewDetails,
  IDeliveryCalendarAddOnOptionsDetails,
  IDeliveryCalendarAddOnOptionsArgs,
  IStartSubscriptionWizardDetails,
  IStartSubscriptionWizardPayload,
  ISubscriptionWizardDraftDetails,
  ISubscriptionWizardAddOnOptionsArgs,
  ISubscriptionWizardAddOnOptionsDetails,
  IUpdateSubscriptionWizardConfigurationPayload,
  IUpdateSubscriptionWizardSchedulePayload,
  IUpdateSubscriptionWizardBillingPayload,
  ISubscriptionWizardPreviewDetails,
  IUpdateSubscriptionWizardRenewalOptionsPayload,
  IUpdateClientAccountAccessPayload,
  IUpdateDeliveryCalendarCutoffSettingsPayload,
  IFinalizeSubscriptionWizardPayload,
} from "src/types/modules/clientsManagement/clientAccountAccess";

type ActivityLogFilterParams = Omit<
  IClientAccountActivityLogsArgs,
  "clientId" | "pageNumber" | "pageSize"
>;

const buildActivityLogFilterParams = (filters: ActivityLogFilterParams) => {
  const params: Record<string, string | number> = {};

  if (filters.search) params.search = filters.search;
  if (filters.action) params.action = filters.action;
  if (filters.actionType !== undefined) params.actionType = filters.actionType;
  if (filters.previousValue) params.previousValue = filters.previousValue;
  if (filters.newValue) params.newValue = filters.newValue;
  if (filters.date) params.date = filters.date;
  if (filters.time) params.time = filters.time;

  return params;
};

const buildActivityLogQueryParams = (args: IClientAccountActivityLogsArgs) => ({
  ...buildActivityLogFilterParams(args),
  pageNumber: args.pageNumber ?? 1,
  pageSize: args.pageSize ?? 10,
});

const showMutationError = (error: unknown) => {
  showErrorToasts(getApiErrorMessage(error));
};

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientAccountAccess"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getClientAccountAccess: query<
        IClientAccountAccessDetails,
        ArgsType & { clientId: string }
      >({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      getDeliveryCalendarCutoffSettings: query<
        IDeliveryCalendarCutoffSettingsDetails,
        ArgsType & { clientId: string }
      >({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/cutoff-settings`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      getDeliveryCalendar: query<IDeliveryCalendarDetails, IDeliveryCalendarArgs>({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId, month, year, status }) => {
          const params: Record<string, number | string> = { month, year };
          if (status !== undefined) params.status = status;

          return {
            url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar`,
            method: "GET",
            params,
          };
        },
        keepUnusedDataFor: 0,
      }),

      getDeliveryCalendarDay: query<
        IDeliveryCalendarDayDetails,
        IDeliveryCalendarDayArgs
      >({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId, date }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/${date}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      getDeliveryCalendarAddOnOptions: query<
        IDeliveryCalendarAddOnOptionsDetails,
        IDeliveryCalendarAddOnOptionsArgs
      >({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId, category }) => {
          const params: Record<string, string> = {};
          if (category) params.category = category;

          return {
            url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/add-on-options`,
            method: "GET",
            params,
          };
        },
        keepUnusedDataFor: 0,
      }),

      changeDeliveryCalendarPaymentMethod: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IChangeDeliveryCalendarPaymentMethodPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/change-method`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      cancelDeliveryCalendar: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: ICancelDeliveryCalendarPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/cancel`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      moveDeliveryCalendar: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IMoveDeliveryCalendarPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/move`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      getDeliveryCalendarPauseStatus: query<
        IDeliveryCalendarPauseStatusDetails,
        { clientId: string }
      >({
        providesTags: ["clientAccountAccess"],
        query: ({ clientId }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/pause-status`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      pauseDeliveryCalendar: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IPauseDeliveryCalendarPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/pause`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      resumeDeliveryCalendar: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IResumeDeliveryCalendarPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/resume`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      addDeliveryCalendarItems: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IAddDeliveryCalendarItemsPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/add-items`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      previewAddDeliveryCalendarItems: mutation<
        IDeliveryCalendarActionPreviewDetails,
        {
          clientId: string;
          data: IPreviewAddDeliveryCalendarItemsPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/add-items/preview`,
          method: "POST",
          data,
        }),
      }),

      changeDeliveryCalendarMealPlan: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IChangeDeliveryCalendarMealPlanPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/change-meal-plan`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      previewChangeDeliveryCalendarMealPlan: mutation<
        IDeliveryCalendarActionPreviewDetails,
        {
          clientId: string;
          data: IPreviewChangeDeliveryCalendarMealPlanPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/change-meal-plan/preview`,
          method: "POST",
          data,
        }),
      }),

      replaceDeliveryCalendarMeals: mutation<
        IDeliveryCalendarDayDetails,
        {
          clientId: string;
          data: IReplaceDeliveryCalendarMealsPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/replace-meals`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(apiService.util.invalidateTags(["clientAccountAccess"]));
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      previewReplaceDeliveryCalendarMeals: mutation<
        IReplaceDeliveryCalendarMealsPreviewDetails,
        {
          clientId: string;
          data: IPreviewReplaceDeliveryCalendarMealsPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/replace-meals/preview`,
          method: "POST",
          data,
        }),
      }),

      updateDeliveryCalendarCutoffSettings: mutation<
        IDeliveryCalendarCutoffSettingsDetails,
        {
          clientId: string;
          data: IUpdateDeliveryCalendarCutoffSettingsPayload;
        }
      >({
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/delivery-calendar/cutoff-settings`,
          method: "PUT",
          data,
        }),
        async onQueryStarted({ clientId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getDeliveryCalendarCutoffSettings",
                  { clientId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      updateClientAccountAccess: mutation<
        IClientAccountAccessDetails,
        { clientId: string; data: IUpdateClientAccountAccessPayload }
      >({
        invalidatesTags: ["clientAccountAccess"],
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      blockClientAccountAccess: mutation<
        IClientAccountAccessDetails,
        { clientId: string; data: IBlockClientAccountAccessPayload }
      >({
        invalidatesTags: ["clientAccountAccess"],
        query: ({ clientId, data }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/block`,
          method: "POST",
          data,
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      unblockClientAccountAccess: mutation<
        IClientAccountAccessDetails,
        { clientId: string }
      >({
        invalidatesTags: ["clientAccountAccess"],
        query: ({ clientId }) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${clientId}/unblock`,
          method: "POST",
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      getClientAccountActivityLogs: query<
        IClientAccountActivityLogsListDto,
        IClientAccountActivityLogsArgs
      >({
        providesTags: ["clientAccountAccess"],
        query: (args) => ({
          url: `${endPoints.clientAccountAccess().pathname}/${args.clientId}/activity-logs`,
          method: "GET",
          params: buildActivityLogQueryParams(args),
        }),
        keepUnusedDataFor: 0,
      }),

      exportClientAccountActivityLogs: mutation<
        void,
        IClientAccountActivityLogsArgs
      >({
        queryFn: async (args) => {
          try {
            const { clientId } = args;

            await downloadAuthenticatedFile({
              path: `${endPoints.clientAccountAccess().pathname}/${clientId}/activity-logs/export`,
              params: buildActivityLogFilterParams(args),
              defaultFilename: `client-${clientId}-activity-logs.csv`,
              forceExtension: "csv",
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

      getSubscriptionWizardDraft: query<
        ISubscriptionWizardDraftDetails,
        { draftId: string }
      >({
        query: ({ draftId }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      getSubscriptionWizardAddOnOptions: query<
        ISubscriptionWizardAddOnOptionsDetails,
        ISubscriptionWizardAddOnOptionsArgs
      >({
        query: ({ category }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/options/add-ons`,
          method: "GET",
          params: { category },
        }),
        keepUnusedDataFor: 0,
      }),

      updateSubscriptionWizardRenewalOptions: mutation<
        ISubscriptionWizardDraftDetails,
        {
          draftId: string;
          data: IUpdateSubscriptionWizardRenewalOptionsPayload;
        }
      >({
        query: ({ draftId, data }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/renewal-options`,
          method: "PUT",
          data,
        }),
        async onQueryStarted({ draftId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getSubscriptionWizardDraft",
                  { draftId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      updateSubscriptionWizardConfiguration: mutation<
        ISubscriptionWizardDraftDetails,
        {
          draftId: string;
          data: IUpdateSubscriptionWizardConfigurationPayload;
        }
      >({
        query: ({ draftId, data }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/configuration`,
          method: "PUT",
          data,
        }),
        async onQueryStarted({ draftId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getSubscriptionWizardDraft",
                  { draftId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      updateSubscriptionWizardSchedule: mutation<
        ISubscriptionWizardDraftDetails,
        {
          draftId: string;
          data: IUpdateSubscriptionWizardSchedulePayload;
        }
      >({
        query: ({ draftId, data }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/schedule`,
          method: "PUT",
          data,
        }),
        async onQueryStarted({ draftId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getSubscriptionWizardDraft",
                  { draftId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      getSubscriptionWizardPreview: query<
        ISubscriptionWizardPreviewDetails,
        { draftId: string }
      >({
        query: ({ draftId }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/preview`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      updateSubscriptionWizardBilling: mutation<
        ISubscriptionWizardDraftDetails,
        {
          draftId: string;
          data: IUpdateSubscriptionWizardBillingPayload;
        }
      >({
        query: ({ draftId, data }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/billing`,
          method: "PUT",
          data,
        }),
        async onQueryStarted({ draftId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getSubscriptionWizardDraft",
                  { draftId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      saveSubscriptionWizardDraft: mutation<
        ISubscriptionWizardDraftDetails,
        { draftId: string }
      >({
        query: ({ draftId }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/save-draft`,
          method: "POST",
        }),
        async onQueryStarted({ draftId }, { dispatch, queryFulfilled }) {
          try {
            const { data: response } = await queryFulfilled;
            if (response?.data) {
              dispatch(
                apiService.util.updateQueryData(
                  "getSubscriptionWizardDraft",
                  { draftId },
                  (draft) => {
                    draft.data = response.data;
                  }
                )
              );
            }
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      finalizeSubscriptionWizard: mutation<
        ISubscriptionWizardDraftDetails,
        {
          draftId: string;
          data: IFinalizeSubscriptionWizardPayload;
        }
      >({
        invalidatesTags: ["clientAccountAccess"],
        query: ({ draftId, data }) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/${draftId}/finalize`,
          method: "POST",
          data,
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            showMutationError(error);
          }
        },
      }),

      startSubscriptionWizard: mutation<
        IStartSubscriptionWizardDetails,
        IStartSubscriptionWizardPayload
      >({
        query: (data) => ({
          url: `${endPoints.manageSubscriptions().pathname}/wizard/start`,
          method: "POST",
          data,
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            showMutationError(error);
          }
        },
      }),
    }),
  });

export const {
  useGetClientAccountAccessQuery,
  useGetDeliveryCalendarCutoffSettingsQuery,
  useGetDeliveryCalendarQuery,
  useGetDeliveryCalendarDayQuery,
  useGetDeliveryCalendarAddOnOptionsQuery,
  useChangeDeliveryCalendarPaymentMethodMutation,
  useCancelDeliveryCalendarMutation,
  useMoveDeliveryCalendarMutation,
  useGetDeliveryCalendarPauseStatusQuery,
  usePauseDeliveryCalendarMutation,
  useResumeDeliveryCalendarMutation,
  useAddDeliveryCalendarItemsMutation,
  usePreviewAddDeliveryCalendarItemsMutation,
  useChangeDeliveryCalendarMealPlanMutation,
  usePreviewChangeDeliveryCalendarMealPlanMutation,
  useReplaceDeliveryCalendarMealsMutation,
  usePreviewReplaceDeliveryCalendarMealsMutation,
  useGetClientAccountActivityLogsQuery,
  useExportClientAccountActivityLogsMutation,
  useGetSubscriptionWizardDraftQuery,
  useGetSubscriptionWizardAddOnOptionsQuery,
  useGetSubscriptionWizardPreviewQuery,
  useStartSubscriptionWizardMutation,
  useUpdateSubscriptionWizardRenewalOptionsMutation,
  useUpdateSubscriptionWizardConfigurationMutation,
  useUpdateSubscriptionWizardScheduleMutation,
  useUpdateSubscriptionWizardBillingMutation,
  useSaveSubscriptionWizardDraftMutation,
  useFinalizeSubscriptionWizardMutation,
  useUpdateDeliveryCalendarCutoffSettingsMutation,
  useUpdateClientAccountAccessMutation,
  useBlockClientAccountAccessMutation,
  useUnblockClientAccountAccessMutation,
} = apiService;
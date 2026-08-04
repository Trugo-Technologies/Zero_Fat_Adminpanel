/** @format */

import { showErrorToasts, showSuccessToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IClientsListDto } from "src/types/modules/clientsManagement/clients";
import {
  IClientNotificationsListDto,
  INotificationLogsListDto,
  ISendNotificationPayload,
} from "src/types/modules/dashboard/notifications";
import { buildManageNotificationClientsRequest } from "../../manageNotificationClientFilterHelpers";
import {
  buildClientNotificationsRequest,
  buildManageNotificationLogsRequest,
} from "../../notificationLogHelpers";

const apiService = api
  .enhanceEndpoints({
    addTagTypes: [
      "notificationLogs",
      "manageNotificationClients",
      "clientNotifications",
    ],
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getManageNotificationClients: query<IClientsListDto, ArgsType>({
        providesTags: ["manageNotificationClients"],
        query: (props) => ({
          url: `${endPoints.manageNotifications().pathname}/clients`,
          method: "GET",
          params: buildManageNotificationClientsRequest(props),
        }),
      }),

      getManageNotificationLogs: query<INotificationLogsListDto, ArgsType>({
        providesTags: ["notificationLogs"],
        query: (props) => ({
          url: `${endPoints.manageNotifications().pathname}/logs`,
          method: "GET",
          params: buildManageNotificationLogsRequest(props),
        }),
      }),

      getClientNotifications: query<IClientNotificationsListDto, ArgsType>({
        providesTags: ["clientNotifications"],
        query: (props) => ({
          url: `${endPoints.manageNotifications().pathname}/clients/${props.clientId}/notifications`,
          method: "GET",
          params: buildClientNotificationsRequest(props),
        }),
      }),

      sendClientNotifications: mutation<void, ISendNotificationPayload>({
        invalidatesTags: ["notificationLogs", "clientNotifications"],
        query: (payload) => ({
          url: `${endPoints.manageNotifications().pathname}/send`,
          method: "POST",
          data: payload,
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            await queryFulfilled;
            showSuccessToasts("Notification sent successfully");
          } catch (error: unknown) {
            const message =
              error &&
              typeof error === "object" &&
              "error" in error &&
              typeof (error as { error?: string }).error === "string"
                ? (error as { error: string }).error
                : "Failed to send notification";
            showErrorToasts(message);
          }
        },
      }),
    }),
  });

export const {
  useGetManageNotificationClientsQuery,
  useLazyGetManageNotificationClientsQuery,
  useGetManageNotificationLogsQuery,
  useGetClientNotificationsQuery,
  useSendClientNotificationsMutation,
} = apiService;

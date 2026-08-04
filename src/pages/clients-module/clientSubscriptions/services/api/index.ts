/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IClientSubscriptionsDetails,
  IClientSubscriptionsListDto,
} from "src/types/modules/clientsManagement/clientSubscriptions";
import {
  ClientSubscriptionExportFilters,
  buildClientSubscriptionExportParams,
  buildClientSubscriptionsFilterRequest,
} from "../../clientSubscriptionFilterHelpers";

export type ExportClientSubscriptionsArgs = ClientSubscriptionExportFilters;

const getExportPath = (exportType: ClientSubscriptionExportFilters["exportType"]) => {
  if (exportType === "new") {
    return `${endPoints.clientReports().pathname}/new-subscriptions/export`;
  }

  return `${endPoints.clientReports().pathname}/renew-subscriptions/export`;
};

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientSubscriptions"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query, mutation }) => ({
      getAllClientSubscriptions: query<IClientSubscriptionsListDto, ArgsType>({
        providesTags: ["clientSubscriptions"],
        query: (props) => ({
          url: `${endPoints.clientSubscriptionsEndpoint().pathname}/filter`,
          method: "GET",
          params: buildClientSubscriptionsFilterRequest(props),
        }),
      }),

      getClientSubscription: query<IClientSubscriptionsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.clientSubscriptionsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      exportClientSubscriptions: mutation<void, ExportClientSubscriptionsArgs>({
        queryFn: async (filters) => {
          try {
            if (!filters.exportType) {
              throw new Error("Select export type before downloading.");
            }

            await downloadAuthenticatedFile({
              path: getExportPath(filters.exportType),
              params: buildClientSubscriptionExportParams(filters),
              defaultFilename:
                filters.exportType === "new"
                  ? "new-subscriptions.xlsx"
                  : "renew-subscriptions.xlsx",
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
  useGetAllClientSubscriptionsQuery,
  useGetClientSubscriptionQuery,
  useExportClientSubscriptionsMutation,
} = apiService;

/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IPaymentsDetails,
  IPaymentsListDto,
} from "src/types/modules/clientsManagement/payments";
import {
  PaymentExportFilters,
  buildPaymentExportParams,
  buildPaymentsFilterRequest,
} from "../../paymentFilterHelpers";

export type ExportPaymentsArgs = PaymentExportFilters & {
  clientId?: string;
};

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["payments"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query, mutation }) => ({
      getAllPayments: query<IPaymentsListDto, ArgsType>({
        providesTags: ["payments"],
        query: (props) => ({
          url: `${endPoints.paymentsEndpoint().pathname}/filter`,
          method: "GET",
          params: buildPaymentsFilterRequest(props),
        }),
      }),

      getPayment: query<IPaymentsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.paymentsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),

      exportPayments: mutation<void, ExportPaymentsArgs>({
        queryFn: async (filters) => {
          try {
            const { clientId, ...exportFilters } = filters;
            const params = buildPaymentExportParams(exportFilters);

            if (clientId) {
              params.clientId = clientId;
            }

            await downloadAuthenticatedFile({
              path: `${endPoints.clientReports().pathname}/payments/export`,
              params,
              defaultFilename: "payments.xlsx",
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
  useGetAllPaymentsQuery,
  useGetPaymentQuery,
  useExportPaymentsMutation,
} = apiService;

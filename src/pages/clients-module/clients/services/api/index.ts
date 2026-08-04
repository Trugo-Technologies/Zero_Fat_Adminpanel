import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IClientDetails,
  IClientsListDto,
} from "src/types/modules/clientsManagement/clients";
import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import {
  buildClientExportParams,
  buildClientsFilterRequest,
  ClientExportFilters,
} from "../../clientFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clients"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query, mutation }) => ({
      getAllClients: query<IClientsListDto, ArgsType>({
        providesTags: ["clients"],
        query: (props) => ({
          url: `${endPoints.clients().pathname}/filter`,
          method: "GET",
          params: buildClientsFilterRequest(props),
        }),
      }),

      updateActiveClients: mutation({
        invalidatesTags: ["clients"],
        query: (id) => ({
          url: `${endPoints.clients().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getClient: query<IClientDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.clients().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      exportClients: mutation<void, ClientExportFilters>({
        queryFn: async (filters) => {
          try {
            await downloadAuthenticatedFile({
              path: `${endPoints.clientReports().pathname}/clients/export`,
              params: buildClientExportParams(filters),
              defaultFilename: "clients.xlsx",
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
  useGetAllClientsQuery,
  useUpdateActiveClientsMutation,
  useGetClientQuery,
  useExportClientsMutation,
} = apiService;

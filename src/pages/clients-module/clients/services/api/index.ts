import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IClientDetails,
  IClientsListDto,
} from "src/types/modules/clientsManagement/clients";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["nutrientsAttributes"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllClients: query<IClientsListDto, ArgsType>({
        providesTags: ["clients"],
        query: (props) => {
          return {
            url: `${endPoints.clients().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
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
    }),
  });
export const {
  useGetAllClientsQuery,
  useUpdateActiveClientsMutation,
  useGetClientQuery,
} = apiService;

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IClientPortalSettingsDetails } from "src/types/modules/clientsManagement/clientPortalSettings";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientPortalSettings"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      updateClientPortalSettings: mutation({
        // invalidatesTags: ["clientPortalSettings"],
        query: ({ data }) => ({
          url: `${endPoints.clientPortalSettingsEndpoint().pathname}`,
          method: "PUT",
          data,
        }),
      }),
      getClientPortalSettings: query<IClientPortalSettingsDetails, ArgsType>({
        query: () => ({
          url: `${endPoints.clientPortalSettingsEndpoint().pathname}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });

export const {
  useGetClientPortalSettingsQuery,
  useUpdateClientPortalSettingsMutation,
} = apiService;

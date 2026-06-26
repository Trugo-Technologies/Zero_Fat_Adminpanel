/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IClientSubscriptionsDetails,
  IClientSubscriptionsListDto,
} from "src/types/modules/clientsManagement/clientSubscriptions";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientSubscriptions"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllClientSubscriptions: query<IClientSubscriptionsListDto, ArgsType>({
        providesTags: ["clientSubscriptions"],
        query: (props) => {
          return {
            url: `${endPoints.clientSubscriptionsEndpoint().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      getClientSubscription: query<IClientSubscriptionsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.clientSubscriptionsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useGetAllClientSubscriptionsQuery,
  useGetClientSubscriptionQuery,
} = apiService;

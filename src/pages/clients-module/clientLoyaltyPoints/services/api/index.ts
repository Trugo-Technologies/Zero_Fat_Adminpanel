/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenMealCountListDto } from "src/types/modules/clientsManagement/kitchen/mealCount";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientLoyaltyPoints"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllClientLoyaltyPoints: query<IKitchenMealCountListDto, ArgsType>({
        providesTags: ["clientLoyaltyPoints"],
        query: (props) => {
          return {
            url: `${endPoints.clientLoyaltyPoints().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
    }),
  });
export const { useGetAllClientLoyaltyPointsQuery } = apiService;

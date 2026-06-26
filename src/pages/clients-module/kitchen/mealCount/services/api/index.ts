/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenMealCountListDto } from "src/types/modules/clientsManagement/kitchen/mealCount";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["mealCount"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllKitchenMealCount: query<IKitchenMealCountListDto, ArgsType>({
        providesTags: ["mealCount"],
        query: (props) => {
          return {
            url: `${endPoints.kitchenMealCount().pathname}`,
            method: "POST",
            data: props,
          };
        },
      }),
    }),
  });
export const { useGetAllKitchenMealCountQuery } = apiService;

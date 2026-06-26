/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenOrderedMealListDto } from "src/types/modules/clientsManagement/kitchen/orderedMeal";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["oderedMeal"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllKitchenOrderedMeal: query<IKitchenOrderedMealListDto, ArgsType>({
        providesTags: ["oderedMeal"],
        query: (props) => {
          return {
            url: `${endPoints.kitchenOrderedMeal().pathname}`,
            method: "POST",
            data: props,
          };
        },
      }),
    }),
  });
export const { useGetAllKitchenOrderedMealQuery } = apiService;

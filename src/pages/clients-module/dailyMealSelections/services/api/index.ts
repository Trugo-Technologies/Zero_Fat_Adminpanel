/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IDailyMealSelectionsDetails,
  IDailyMealSelectionsListDto,
} from "src/types/modules/clientsManagement/dailyMealSelections";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["dailyMealSelections"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllDailyMealSelections: query<IDailyMealSelectionsListDto, ArgsType>({
        providesTags: ["dailyMealSelections"],
        query: (props) => {
          return {
            url: `${endPoints.dailyMealSelections().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      getDailyMealSelection: query<IDailyMealSelectionsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.dailyMealSelections().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useGetAllDailyMealSelectionsQuery,
  useGetDailyMealSelectionQuery,
} = apiService;

/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IDailySelectionsDetails,
  IDailySelectionsListDto,
} from "src/types/modules/clientsManagement/dailySelections";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["dailySelections"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllDailySelections: query<IDailySelectionsListDto, ArgsType>({
        providesTags: ["dailySelections"],
        query: (props) => {
          return {
            url: `${endPoints.dailySelections().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      getDailySelection: query<IDailySelectionsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.dailySelections().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const { useGetAllDailySelectionsQuery, useGetDailySelectionQuery } =
  apiService;

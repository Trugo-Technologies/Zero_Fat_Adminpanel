/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IDailySelectionsDetails,
  IDailySelectionsListDto,
} from "src/types/modules/clientsManagement/dailySelections";
import { buildDailySelectionsFilterRequest } from "../../dailySelectionFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["dailySelections"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllDailySelections: query<IDailySelectionsListDto, ArgsType>({
        providesTags: ["dailySelections"],
        query: (props) => ({
          url: `${endPoints.dailySelections().pathname}/filter`,
          method: "GET",
          params: buildDailySelectionsFilterRequest(props),
        }),
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

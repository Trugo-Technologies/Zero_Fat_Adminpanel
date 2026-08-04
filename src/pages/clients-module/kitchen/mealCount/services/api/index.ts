/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenMealCountListDto } from "src/types/modules/clientsManagement/kitchen/mealCount";
import {
  KitchenMealCountExportFilters,
  buildKitchenMealCountExportParams,
} from "../../kitchenMealCountFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["mealCount"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
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

      exportKitchenMealCount: mutation<void, KitchenMealCountExportFilters>({
        queryFn: async (filters) => {
          try {
            await downloadAuthenticatedFile({
              path: `${endPoints.clientReports().pathname}/kitchen/meal-count/export`,
              params: buildKitchenMealCountExportParams(filters),
              defaultFilename: "kitchen-meal-count.xlsx",
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
  useGetAllKitchenMealCountQuery,
  useExportKitchenMealCountMutation,
} = apiService;

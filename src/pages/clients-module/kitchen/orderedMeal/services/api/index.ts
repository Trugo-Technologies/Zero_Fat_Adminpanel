/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { downloadAuthenticatedFile } from "src/Helpers/download-authenticated-file";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenOrderedMealListDto } from "src/types/modules/clientsManagement/kitchen/orderedMeal";
import {
  KitchenOrderedMealExportFilters,
  buildKitchenOrderedMealExportParams,
} from "../../kitchenOrderedMealFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["oderedMeal"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
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

      exportKitchenOrderedMeal: mutation<void, KitchenOrderedMealExportFilters>({
        queryFn: async (filters) => {
          try {
            await downloadAuthenticatedFile({
              path: `${endPoints.clientReports().pathname}/delivery/export`,
              params: buildKitchenOrderedMealExportParams(filters),
              defaultFilename: "delivery.xlsx",
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
  useGetAllKitchenOrderedMealQuery,
  useExportKitchenOrderedMealMutation,
} = apiService;

/** @format */

import { IBaseResponseDetailsDto } from "src/types/baseEntity";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  ClientsReportSummary,
  ClientsStatistics,
  KitchenMealCountReportSummary,
  MealRatingsSummary,
  NutriplanStatistics,
  WorkoutStatistics,
} from "src/types/modules/dashboard";
import { IMealRating } from "src/types/modules/clientsManagement/mealRatings";
import { buildDashboardReportRequest } from "../../dashboardFilterHelpers";

const clientsReportsBasePath = endPoints.clientReports().pathname;
const mealRatingsReportsBasePath = `${clientsReportsBasePath}/meal-ratings`;
const kitchenReportsBasePath = `${clientsReportsBasePath}/kitchen`;

const apiService = api
  .enhanceEndpoints({
    addTagTypes: [
      "workoutStatistics",
      "clientsReportSummary",
      "kitchenMealCountSummary",
    ],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ query }) => ({
      getWorkoutStatistics: query<
        IBaseResponseDetailsDto<WorkoutStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.workoutStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),
      getNutriplanStatistics: query<
        IBaseResponseDetailsDto<NutriplanStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.nutriplanStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),
      getClientStatistics: query<
        IBaseResponseDetailsDto<ClientsStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.clientStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),
      getClientsReportSummary: query<
        IBaseResponseDetailsDto<ClientsReportSummary>,
        ArgsType
      >({
        providesTags: ["clientsReportSummary"],
        query: (props) => ({
          url: `${clientsReportsBasePath}/clients/summary`,
          method: "GET",
          params: buildDashboardReportRequest(props),
        }),
        keepUnusedDataFor: 0,
      }),
      getKitchenMealCountSummary: query<
        IBaseResponseDetailsDto<KitchenMealCountReportSummary>,
        ArgsType
      >({
        providesTags: ["kitchenMealCountSummary"],
        query: (props) => ({
          url: `${kitchenReportsBasePath}/meal-count/summary`,
          method: "GET",
          params: buildDashboardReportRequest(props),
        }),
        keepUnusedDataFor: 0,
      }),
      getMealRatingsSummary: query<
        IBaseResponseDetailsDto<MealRatingsSummary>,
        ArgsType
      >({
        query: () => ({
          url: `${mealRatingsReportsBasePath}/summary-count`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),
      getRecentMealRatings: query<
        IBaseResponseDetailsDto<IMealRating[]>,
        { limit?: number }
      >({
        query: ({ limit = 5 }) => ({
          url: `${mealRatingsReportsBasePath}/recent`,
          method: "GET",
          params: { limit },
        }),
        keepUnusedDataFor: 0,
      }),
    }),
  });

export const {
  useGetWorkoutStatisticsQuery,
  useGetNutriplanStatisticsQuery,
  useGetClientStatisticsQuery,
  useGetClientsReportSummaryQuery,
  useGetMealRatingsSummaryQuery,
  useGetRecentMealRatingsQuery,
  useGetKitchenMealCountSummaryQuery,
} = apiService;

/** @format */

import { IBaseResponseDetailsDto } from "src/types/baseEntity";
/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  ClientsStatistics,
  NutriplanStatistics,
  WorkoutStatistics,
} from "src/types/modules/dashboard";
const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workoutStatistics"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getWorkoutStatistics: query<
        IBaseResponseDetailsDto<WorkoutStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.workoutStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      getNutriplanStatistics: query<
        IBaseResponseDetailsDto<NutriplanStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.nutriplanStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      getClientStatistics: query<
        IBaseResponseDetailsDto<ClientsStatistics>,
        ArgsType
      >({
        query: () => ({
          url: endPoints.clientStatistics().pathname,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useGetWorkoutStatisticsQuery,
  useGetNutriplanStatisticsQuery,
  useGetClientStatisticsQuery,
} = apiService;

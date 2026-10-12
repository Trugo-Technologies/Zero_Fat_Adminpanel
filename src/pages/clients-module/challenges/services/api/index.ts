/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IChallengeDetailsDto,
  IChallengeLeaderboardDetailsDto,
  IChallengeParticipantsListDto,
  IChallengesListDto,
  ICreateChallengeDto,
  IUpdateChallengeDto,
} from "src/types/modules/clientsManagement/challenges";

const TAG_NAME = "challenges";

const challengesService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ mutation, query }) => ({
      getAllChallenges: query<IChallengesListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (props) => {
          const status = props.status;
          const hasStatus =
            status !== undefined &&
            status !== null &&
            status !== "" &&
            status !== "all";

          return {
            url: endPoints.challenges().pathname,
            method: "GET",
            params: {
              ...(hasStatus ? { status: Number(status) } : {}),
              ...(props.pageNumber != null
                ? { pageNumber: props.pageNumber }
                : {}),
              ...(props.pageSize != null ? { pageSize: props.pageSize } : {}),
              ...(props.keyword ? { keyword: props.keyword } : {}),
            },
          };
        },
      }),

      getChallengeById: query<IChallengeDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.challenges().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      getChallengeParticipants: query<
        IChallengeParticipantsListDto,
        ArgsType
      >({
        providesTags: [TAG_NAME],
        query: (props) => {
          const status = props.status;
          const hasStatus =
            status !== undefined &&
            status !== null &&
            status !== "" &&
            status !== "all";

          return {
            url: `${endPoints.challenges().pathname}/${props.id}/participants`,
            method: "GET",
            params: {
              ...(hasStatus ? { status: Number(status) } : {}),
              ...(props.pageNumber != null
                ? { pageNumber: props.pageNumber }
                : {}),
              ...(props.pageSize != null ? { pageSize: props.pageSize } : {}),
              ...(props.keyword ? { keyword: props.keyword } : {}),
              ...(props.search ? { search: props.search } : {}),
            },
          };
        },
      }),

      getChallengeLeaderboard: query<
        IChallengeLeaderboardDetailsDto,
        { id: string; top?: number }
      >({
        query: ({ id, top = 100 }) => ({
          url: `${endPoints.challenges().pathname}/${id}/leaderboard`,
          method: "GET",
          params: { top },
        }),
        keepUnusedDataFor: 0,
      }),

      createChallenge: mutation<unknown, ICreateChallengeDto>({
        invalidatesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.challenges().pathname,
          method: "POST",
          data,
        }),
      }),

      updateChallenge: mutation<
        unknown,
        { id: string; data: IUpdateChallengeDto }
      >({
        invalidatesTags: [TAG_NAME],
        query: ({ id, data }) => ({
          url: `${endPoints.challenges().pathname}/${id}`,
          method: "PUT",
          data,
        }),
      }),

      publishChallenge: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.challenges().pathname}/${id}/publish`,
          method: "PATCH",
        }),
      }),

      cancelChallenge: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.challenges().pathname}/${id}/cancel`,
          method: "PATCH",
        }),
      }),
    }),
  });

export const {
  useGetAllChallengesQuery,
  useGetChallengeByIdQuery,
  useGetChallengeParticipantsQuery,
  useGetChallengeLeaderboardQuery,
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
  usePublishChallengeMutation,
  useCancelChallengeMutation,
} = challengesService;

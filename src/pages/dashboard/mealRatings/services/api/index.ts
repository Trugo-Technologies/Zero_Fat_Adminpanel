/** @format */

import { showErrorToasts, showSuccessToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { ArgsType } from "src/types";
import { IBaseResponse } from "src/types/baseEntity";
import {
  IMealRatingByDailyMealDetails,
  IMealRatingReplyPayload,
  IMealRatingsListDto,
} from "src/types/modules/clientsManagement/mealRatings";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["mealRatings"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMealRatings: query<IMealRatingsListDto, ArgsType>({
        providesTags: ["mealRatings"],
        query: (props) => ({
          url: "/clientPortal-module/MealRatings/search",
          method: "POST",
          data: {
            pageNumber: props.pageNumber ?? 1,
            pageSize: props.pageSize ?? 10,
            keyword: props.keyword || undefined,
            search: props.search || undefined,
            orderBy: props.orderBy,
            rating: props.rating,
            clientId: props.clientId || undefined,
            mealId: props.mealId || undefined,
            dateFrom: props.dateFrom || undefined,
            dateTo: props.dateTo || undefined,
          },
        }),
      }),
      getMealRatingByDailyMeal: query<IMealRatingByDailyMealDetails, ArgsType>({
        query: ({ id }) => ({
          url: `/clientPortal-module/MealRatings/by-daily-meal/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),
      replyMealRating: mutation<IBaseResponse, IMealRatingReplyPayload>({
        invalidatesTags: ["mealRatings"],
        query: ({ id, reply }) => ({
          url: `/clientPortal-module/MealRatings/${id}/reply`,
          method: "PUT",
          data: { id, reply },
        }),
        async onQueryStarted(_arg, { queryFulfilled }) {
          try {
            await queryFulfilled;
            showSuccessToasts("Reply sent successfully");
          } catch (error: any) {
            const message =
              error?.error?.response?.data?.messages?.[0] ||
              error?.error?.response?.data?.title ||
              "Failed to send reply";
            showErrorToasts(message);
          }
        },
      }),
    }),
  });

export const {
  useGetAllMealRatingsQuery,
  useGetMealRatingByDailyMealQuery,
  useReplyMealRatingMutation,
} = apiService;

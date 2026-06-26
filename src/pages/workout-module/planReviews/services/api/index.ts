import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IPlanReviewsListDto } from "src/types/modules/workout/planReviews";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["planReviews"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPlanReviews: query<IPlanReviewsListDto, ArgsType>({
        providesTags: ["planReviews"],
        query: (props) => {
          return {
            url: `${endPoints.planReviews().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
    }),
  });
export const { useGetAllPlanReviewsQuery } = apiService;

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  ISubscriptionPlansDetails,
  ISubscriptionPlansListDto,
} from "src/types/modules/core/subscriptionPlans";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["workouts"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllSubscriptionPlans: query<ISubscriptionPlansListDto, ArgsType>({
        providesTags: ["subscriptionPlans"],
        query: (props) => {
          return {
            url: `${endPoints.subscriptionPlansEndpoint().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
        keepUnusedDataFor: 0,
      }),

      updateActiveSubscriptionPlan: mutation({
        invalidatesTags: ["subscriptionPlans"],
        query: (id) => ({
          url: `${endPoints.subscriptionPlansEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      publishSubscriptionPlan: mutation({
        invalidatesTags: ["subscriptionPlans"],
        query: (id) => ({
          url: `${endPoints.subscriptionPlansEndpoint().pathname}/publish/${id}`,
          method: "PUT",
        }),
      }),

      getSubscriptionPlan: query<ISubscriptionPlansDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.subscriptionPlansEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useGetAllSubscriptionPlansQuery,
  useGetSubscriptionPlanQuery,
  usePublishSubscriptionPlanMutation,
  useUpdateActiveSubscriptionPlanMutation,
} = apiService;

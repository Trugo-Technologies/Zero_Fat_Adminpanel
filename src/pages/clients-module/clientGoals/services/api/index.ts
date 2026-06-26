import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IKitchenMealCountListDto } from "src/types/modules/clientsManagement/kitchen/mealCount";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["clientGoals"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllClientGoals: query<IKitchenMealCountListDto, ArgsType>({
        providesTags: ["clientGoals"],
        query: (props) => {
          return {
            url: `${endPoints.clientGoals().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
    }),
  });
export const { useGetAllClientGoalsQuery } = apiService;

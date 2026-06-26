import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";

export type plansType = {
  id: string;
  nameAr: string;
  nameEn: string;
  avatarImageUrl: string;
  profileMediaUrl: string;
  daysPerWeek: number;
  level: string;
  isActive: boolean;
  weeklyRepetition: number;
  trainerId: string;
  planGoalId: string;
  createdOn: string;
  createdByName: string;
  lastModifiedByName: string;
  lastModifiedOn: string;
  trainer: {
    id: string;
    nameAr: string;
    nameEn: string;
    avatarImageUrl: string;
    profileMediaUrl: string;
    specialisesIn: string[];
    type: string;
    isActive: boolean;
  };
  planGoal: {
    id: string;
    nameAr: string;
    nameEn: string;
    imageUrl: string;
    isActive: true;
  };
};

type ResType = {
  currentPage: 0;
  totalPages: 0;
  totalCount: 0;
  pageSize: 0;
  hasPreviousPage: true;
  hasNextPage: true;
  data: plansType[];
};

type plansById = {};

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["plan"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPlans: query<ResType, ArgsType>({
        providesTags: ["plan"],
        query: (props) => {
          return {
            url: endPoints.planEndpoint().pathname + "/search",
            method: "POST",
            data: props,
          };
        },
      }),
      add: mutation<void, any>({
        invalidatesTags: ["plan"],
        query: (data) => ({
          url: endPoints.planEndpoint().pathname,
          method: "POST",
          data,
        }),
      }),
      edit: mutation<void, any>({
        invalidatesTags: ["plan"],

        query: ({ data, id }) => ({
          url: `${endPoints.planEndpoint().pathname}/${id}`,
          method: "PUT",
          data,
        }),
      }),
      updateActive: mutation({
        invalidatesTags: ["plan"],
        query: (id) => ({
          url: `${endPoints.planEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      deletePlan: mutation({
        query: (id) => ({
          url: `${endPoints.planEndpoint().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddMutation,
  useDeletePlanMutation,
  useGetAllPlansQuery,
  useEditMutation,
  useUpdateActiveMutation,
} = apiService;

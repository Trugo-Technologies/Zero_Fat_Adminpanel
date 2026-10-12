/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IHomeBannerDetailsDto,
  IHomeBannersListDto,
} from "src/types/modules/clientsManagement/homeBanners";

const TAG_NAME = "homeBanners";

const homeBannersService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ mutation, query }) => ({
      getAllHomeBanners: query<IHomeBannersListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (props) => {
          const params = props as ArgsType & {
            duration?: string;
            audience?: string;
            deliveryTime?: string;
          };
          const search =
            params.search || params.keyword || params.searchValue || "";
          const hasIsActive =
            params.isActive !== undefined && params.isActive !== null;

          return {
            url: `${endPoints.homeBanners().pathname}/filter`,
            method: "GET",
            params: {
              ...(search ? { search } : {}),
              ...(hasIsActive ? { isActive: params.isActive } : {}),
              ...(typeof params.duration === "string" && params.duration
                ? { duration: params.duration }
                : {}),
              ...(typeof params.audience === "string" && params.audience
                ? { audience: params.audience }
                : {}),
              ...(typeof params.deliveryTime === "string" &&
              params.deliveryTime
                ? { deliveryTime: params.deliveryTime }
                : {}),
              ...(params.pageNumber != null
                ? { pageNumber: params.pageNumber }
                : {}),
              ...(params.pageSize != null ? { pageSize: params.pageSize } : {}),
            },
          };
        },
        keepUnusedDataFor: 0,
      }),

      getHomeBannerById: query<IHomeBannerDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.homeBanners().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      createHomeBanner: mutation<unknown, FormData>({
        invalidatesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.homeBanners().pathname,
          method: "POST",
          data,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      }),

      updateHomeBanner: mutation<unknown, { id: string; data: FormData }>({
        invalidatesTags: [TAG_NAME],
        query: ({ id, data }) => ({
          url: `${endPoints.homeBanners().pathname}/${id}`,
          method: "PUT",
          data,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      }),

      toggleHomeBannerActive: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.homeBanners().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      deleteHomeBanner: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.homeBanners().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });

export const {
  useGetAllHomeBannersQuery,
  useGetHomeBannerByIdQuery,
  useCreateHomeBannerMutation,
  useUpdateHomeBannerMutation,
  useToggleHomeBannerActiveMutation,
  useDeleteHomeBannerMutation,
} = homeBannersService;

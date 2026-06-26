/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import { IBannerDetails, IBannerListDto } from "src/types/modules/core/banners";

const service = api
  .enhanceEndpoints({ addTagTypes: ["banners"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllBanners: query<IBannerListDto, ArgsType>({
        providesTags: ["banners"],
        query: (data) => ({
          url: endPoints.bannersEndpoint().pathname + "/search",
          method: "POST",
          data,
        }),
      }),

      addBanner: mutation<void, any>({
        query: (data) => ({
          url: endPoints.bannersEndpoint().pathname,
          method: "POST",

          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "banners" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      updateBanner: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.bannersEndpoint().pathname}/${id}`,
          method: "PUT",
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "banners" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      updateActiveBanner: mutation({
        invalidatesTags: ["banners"],
        query: (id) => ({
          url: `${endPoints.bannersEndpoint().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),

      deleteBanner: mutation({
        invalidatesTags: ["banners"],

        query: (id) => ({
          url: endPoints.bannersEndpoint().pathname + `/${id}`,
          method: "DELETE",
        }),
      }),

      getBanner: query<IBannerDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.bannersEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const {
  useDeleteBannerMutation,
  useGetBannerQuery,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
  useAddBannerMutation,
  useUpdateActiveBannerMutation,
} = service;

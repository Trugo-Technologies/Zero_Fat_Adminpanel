/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  ICreateCustomizePricingDto,
  ICustomizePricingDetailsDto,
  ICustomizePricingListDto,
  IUpdateCustomizePricingDto,
} from "src/types/modules/nutriplan/customizePricing";
import { buildCustomizePricingSearchRequest } from "../../customizePricingFilterHelpers";

const TAG_NAME = "customizePricingTiers";

const customizePricingService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ mutation, query }) => ({
      getAllCustomizePricing: query<ICustomizePricingListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (props) => ({
          url: `${endPoints.customizePricingTiers().pathname}/search`,
          method: "POST",
          data: buildCustomizePricingSearchRequest(props),
        }),
        keepUnusedDataFor: 0,
      }),

      getCustomizePricingById: query<ICustomizePricingDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.customizePricingTiers().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      createCustomizePricing: mutation<unknown, ICreateCustomizePricingDto>({
        invalidatesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.customizePricingTiers().pathname,
          method: "POST",
          data,
        }),
      }),

      updateCustomizePricing: mutation<
        unknown,
        { id: string; data: IUpdateCustomizePricingDto }
      >({
        invalidatesTags: [TAG_NAME],
        query: ({ id, data }) => ({
          url: `${endPoints.customizePricingTiers().pathname}/${id}`,
          method: "PUT",
          data,
        }),
      }),

      deleteCustomizePricing: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.customizePricingTiers().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });

export const {
  useGetAllCustomizePricingQuery,
  useGetCustomizePricingByIdQuery,
  useCreateCustomizePricingMutation,
  useUpdateCustomizePricingMutation,
  useDeleteCustomizePricingMutation,
} = customizePricingService;

/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IPaymentsDetails,
  IPaymentsListDto,
} from "src/types/modules/clientsManagement/payments";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["payments"] })
  .injectEndpoints({
    endpoints: ({ query }) => ({
      getAllPayments: query<IPaymentsListDto, ArgsType>({
        providesTags: ["payments"],
        query: (props) => {
          return {
            url: `${endPoints.paymentsEndpoint().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),

      getPayment: query<IPaymentsDetails, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.paymentsEndpoint().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
    }),
  });
export const { useGetAllPaymentsQuery, useGetPaymentQuery } = apiService;

/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IClientLocationsDetails,
  IClientLocationsListDto,
} from "src/types/modules/clientsManagement/clientLocations";

const service = api
  .enhanceEndpoints({ addTagTypes: ["clientLocations"] })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      getAllClientLocations: query<IClientLocationsListDto, ArgsType>({
        providesTags: ["clientLocations"],
        query: (data) => ({
          url: endPoints.clientLocations().pathname + "/search",
          method: "POST",
          data,
        }),
      }),

      addClientLocation: mutation<void, any>({
        query: (data) => ({
          url: endPoints.clientLocations().pathname,
          method: "POST",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(api.util.invalidateTags([{ type: "clientLocations" }]));
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editClientLocation: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.clientLocations().pathname}/${id}`,
          method: "PUT",
          data,
        }),

        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(api.util.invalidateTags([{ type: "clientLocations" }]));
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;

            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

    deleteClientLocation: mutation({
      invalidatesTags: ["clientLocations"],
      query: (id) => ({
        url: endPoints.clientLocations().pathname + `/${id}`,
        method: "DELETE",
      }),
    }),

    updateActiveClientLocation: mutation({
      invalidatesTags: ["clientLocations"],
      query: (id) => ({
        url: `${endPoints.clientLocations().pathname}/active/${id}`,
        method: "PUT",
      }),
    }),

    getClientLocationDetails: query<IClientLocationsDetails, ArgsType>({
      query: ({ id }) => ({
        url: `${endPoints.clientLocations().pathname}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Disable caching
    }),
  }),
});
export const {
  useAddClientLocationMutation,
  useEditClientLocationMutation,
  useDeleteClientLocationMutation,
  useGetAllClientLocationsQuery,
  useGetClientLocationDetailsQuery,
  useUpdateActiveClientLocationMutation,
} = service;

/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import {
  IEquipmentDetailsDto,
  IEquipmentsListDto,
} from "src/types/modules/workout/equipments";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["equipments"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllEquipments: query<IEquipmentsListDto, ArgsType>({
        providesTags: ["equipments"],
        query: (props) => {
          return {
            url: `${endPoints.equipments().pathname}/search`,
            method: "POST",

            data: props,
          };
        },
      }),
      addEquipment: mutation<void, any>({
        query: (data) => ({
          url: endPoints.equipments().pathname,
          method: "POST",
          data: serialize(
            { ...data },
            {
              noAttributesWithArrayNotation: false,
              dotsForObjectNotation: false,
              noFilesWithArrayNotation: false,
              allowEmptyArrays: false,

              indices: true,
            }
          ),
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "equipments" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editEquipment: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.equipments().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "equipments" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      activeEquipment: mutation({
        invalidatesTags: ["equipments"],
        query: (id) => ({
          url: `${endPoints.equipments().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getEquipment: query<IEquipmentDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.equipments().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteEquipment: mutation({
        invalidatesTags: ["equipments"],
        query: (id) => ({
          url: `${endPoints.equipments().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllEquipments: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.equipments().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "equipments" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllEquipments: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints.equipments().pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "equipments" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
    }),
  });
export const {
  useGetAllEquipmentsQuery,
  useGetEquipmentQuery,
  useAddEquipmentMutation,
  useEditEquipmentMutation,
  useActiveEquipmentMutation,
  useDeleteEquipmentMutation,
  useDeleteAllEquipmentsMutation,
  useActiveAllEquipmentsMutation,
} = apiService;

/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IActiveAllPayload, IBaseErrorResponse } from "src/types/baseEntity";
import { IMeasurmentUnitsDetailsDto } from "src/types/modules/nutriplan/measurementUnits";
import {
  ICreateEquipmentCategoryDto,
  IEquipmentCategoriesListDto,
  IEquipmentCategoryDetailsDto,
  IUpdateEquipmentCategoryDto,
} from "src/types/modules/workout/equipmentCategories";
import {
  IWorkoutBodyPartDetailsDto,
  IWorkoutBodyPartsListDto,
} from "src/types/modules/workout/workoutBodyParts";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["equipmentCategories"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllEquipmentCategories: query<IEquipmentCategoriesListDto, ArgsType>({
        providesTags: ["equipmentCategories"],
        query: (props) => {
          return {
            url: `${endPoints.workoutEquipmentCategories().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addEquipmentCategory: mutation<void, any>({
        invalidatesTags: ["equipmentCategories"],
        query: (data) => ({
          url: endPoints.workoutEquipmentCategories().pathname,
          method: "POST",
          data,
        }),
      }),
      editEquipmentCategory: mutation<void, any>({
        invalidatesTags: ["equipmentCategories"],

        query: ({ data, id }) => ({
          url: `${endPoints.workoutEquipmentCategories().pathname}/${id}`,
          method: "PUT",
          data,
        }),
      }),
      activeEquipmentCategory: mutation({
        invalidatesTags: ["equipmentCategories"],
        query: (id) => ({
          url: `${endPoints.workoutEquipmentCategories().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getEquipmentCategory: query<IEquipmentCategoryDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.workoutEquipmentCategories().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteEquipmentCategory: mutation({
        invalidatesTags: ["equipmentCategories"],
        query: (id) => ({
          url: `${endPoints.workoutEquipmentCategories().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      deleteAllEquipmentCategory: mutation<void, Array<string>>({
        query: (data) => ({
          url: endPoints.equipmentCategoriesEndpoint().pathname,
          method: "DELETE",
          data: { ids: data },
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(
              api.util.invalidateTags([{ type: "equipmentCategories" }])
            ); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      activeAllEquipmentCategory: mutation<void, IActiveAllPayload>({
        query: (data) => ({
          url: endPoints
            .equipmentCategoriesEndpoint()
            .pathname.concat("/active"),
          method: "PUT",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(
              api.util.invalidateTags([{ type: "equipmentCategories" }])
            ); // Correct format
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
  useGetAllEquipmentCategoriesQuery,
  useAddEquipmentCategoryMutation,
  useEditEquipmentCategoryMutation,
  useGetEquipmentCategoryQuery,
  useActiveEquipmentCategoryMutation,
  useDeleteEquipmentCategoryMutation,
  useDeleteAllEquipmentCategoryMutation,
  useActiveAllEquipmentCategoryMutation,
} = apiService;

/** @format */

import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IMeasurmentUnitsDetailsDto,
  IMeasurmentUnitsListDto,
} from "src/types/modules/nutriplan/measurementUnits";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["measurementUnits"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMeasurementUnits: query<IMeasurmentUnitsListDto, ArgsType>({
        providesTags: ["measurementUnits"],
        query: (props) => {
          return {
            url: `${endPoints.measurementUnit().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addMeasurementUnit: mutation<void, any>({
        query: (data) => ({
          url: endPoints.measurementUnit().pathname,
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
            dispatch(api.util.invalidateTags([{ type: "measurementUnits" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editMeasurementUnit: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.measurementUnit().pathname}/${id}`,
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
            dispatch(api.util.invalidateTags([{ type: "measurementUnits" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),
      updateActiveMeasurementUnit: mutation({
        invalidatesTags: ["measurementUnits"],
        query: (id) => ({
          url: `${endPoints.measurementUnit().pathname}/active/${id}`,
          method: "PUT",
        }),
      }),
      getMeasurementUnit: query<IMeasurmentUnitsDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.measurementUnit().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMeasurementUnit: mutation({
        invalidatesTags: ["measurementUnits"],
        query: (id) => ({
          url: `${endPoints.measurementUnit().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useGetAllMeasurementUnitsQuery,
  useGetMeasurementUnitQuery,
  useDeleteMeasurementUnitMutation,
  useEditMeasurementUnitMutation,
  useAddMeasurementUnitMutation,
  useUpdateActiveMeasurementUnitMutation,
} = apiService;

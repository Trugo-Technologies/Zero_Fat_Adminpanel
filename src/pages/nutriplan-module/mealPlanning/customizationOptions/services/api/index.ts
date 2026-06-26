/** @format */
import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  ICustomizationOptionsListDto,
  ICustomizationOptionDetailsDto,
} from "src/types/modules/nutriplan/mealPlanning/customizationOptions";

const TAG_NAME = "CustomizationOptions";
const apiService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCustomizationOptions: query<ICustomizationOptionsListDto, ArgsType>(
        {
          providesTags: [TAG_NAME],
          query: (props) => {
            return {
              url: `${endPoints.customizationOptions().pathname}/search`,
              method: "POST",
              data: props,
            };
          },
        }
      ),
      addCustomizationOption: mutation<void, any>({
        query: (data) => ({
          url: endPoints.customizationOptions().pathname,
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
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: TAG_NAME }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      editCustomizationOption: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.customizationOptions().pathname}/${id}`,
          method: "PUT",
          data: serialize(
            { ...data },
            {
              indices: true,
            }
          ),
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: TAG_NAME }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),
      getCustomizationOption: query<ICustomizationOptionDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.customizationOptions().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteCustomizationOption: mutation({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.customizationOptions().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddCustomizationOptionMutation,
  useEditCustomizationOptionMutation,
  useDeleteCustomizationOptionMutation,
  useGetAllCustomizationOptionsQuery,
  useGetCustomizationOptionQuery,
} = apiService;

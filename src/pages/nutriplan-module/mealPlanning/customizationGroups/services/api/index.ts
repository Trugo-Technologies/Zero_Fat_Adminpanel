/** @format */
import { serialize } from "object-to-formdata";
import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  ICustomizationGroupDetailsDto,
  ICustomizationGroupsListDto,
} from "src/types/modules/nutriplan/mealPlanning/customizationGroups";

const TAG_NAME = "CustomizationGroups";
const apiService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCustomizationGroups: query<ICustomizationGroupsListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (props) => {
          return {
            url: `${endPoints.customizationGroups().pathname}/search`,
            method: "POST",
            data: props,
          };
        },
      }),
      addCustomizationGroup: mutation<void, any>({
        query: (data) => ({
          url: endPoints.customizationGroups().pathname,
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
      editCustomizationGroup: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.customizationGroups().pathname}/${id}`,
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
      getCustomizationGroup: query<ICustomizationGroupDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.customizationGroups().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteCustomizationGroup: mutation({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.customizationGroups().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddCustomizationGroupMutation,
  useEditCustomizationGroupMutation,
  useDeleteCustomizationGroupMutation,
  useGetAllCustomizationGroupsQuery,
  useGetCustomizationGroupQuery,
} = apiService;

/** @format */

import { showErrorToasts } from "src/Components/toasts";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IBaseErrorResponse } from "src/types/baseEntity";
import {
  IMenusDetailsDto,
  IMenusListDto,
} from "src/types/modules/nutriplan/menuManagement/menus";
import { buildMenusFilterRequest } from "../../menuFilterHelpers";

const apiService = api
  .enhanceEndpoints({ addTagTypes: ["nutrientsAttributes"] })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllMenus: query<IMenusListDto, ArgsType>({
        providesTags: ["menus"],
        query: (props) => ({
          url: `${endPoints.menus().pathname}/filter`,
          method: "GET",
          params: buildMenusFilterRequest(props),
        }),
      }),

      addMenu: mutation<void, any>({
        query: (data) => ({
          url: endPoints.menus().pathname,
          method: "POST",

          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "menus" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      copyMenu: mutation<void, any>({
        query: (data) => ({
          url: endPoints.menus().pathname.concat("/copy"),
          method: "POST",
          data,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "menus" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            showErrorToasts(
              errorResponse?.error?.response?.data?.errors?.join(", ") ?? ""
            );
            throw error;
          }
        },
      }),

      editMenu: mutation<void, any>({
        query: ({ data, id }) => ({
          url: `${endPoints.menus().pathname}/${id}`,
          method: "PUT",
          data,
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "menus" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      updatePublishMenu: mutation<void, any>({
        query: (id) => ({
          url: `${endPoints.menus().pathname}/${id}/publish`,
          method: "PUT",
          data: {
            id,
          },
        }),
        async onQueryStarted(data, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled; // Wait for the mutation to finish
            // Invalidate the tag on success
            dispatch(api.util.invalidateTags([{ type: "menus" }])); // Correct format
          } catch (error) {
            const errorResponse = error as IBaseErrorResponse;
            // showErrorToasts(errorResponse?.error?.response?.data?.errors?.join(', ') ?? '');
            throw error;
          }
        },
      }),

      getMenu: query<IMenusDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.menus().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0, // Disable caching
      }),
      deleteMenu: mutation({
        invalidatesTags: ["menus"],
        query: (id) => ({
          url: `${endPoints.menus().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
export const {
  useAddMenuMutation,
  useEditMenuMutation,
  useDeleteMenuMutation,
  useUpdatePublishMenuMutation,
  useGetMenuQuery,
  useGetAllMenusQuery,
  useCopyMenuMutation,
} = apiService;

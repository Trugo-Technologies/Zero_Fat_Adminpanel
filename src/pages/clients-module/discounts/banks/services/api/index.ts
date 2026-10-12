/** @format */

import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import {
  IPromoBankDetailsDto,
  IPromoBanksListDto,
} from "src/types/modules/clientsManagement/discounts/banks";

const TAG_NAME = "banks";

const banksService = api
  .enhanceEndpoints({ addTagTypes: [TAG_NAME] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: ({ mutation, query }) => ({
      getAllBanks: query<IPromoBanksListDto, ArgsType>({
        providesTags: [TAG_NAME],
        query: (props) => {
          const search =
            props.search || props.keyword || props.searchValue || "";
          const hasIsActive =
            props.isActive !== undefined && props.isActive !== null;

          return {
            url: `${endPoints.banks().pathname}/filter`,
            method: "GET",
            params: {
              ...(search ? { search } : {}),
              ...(hasIsActive ? { isActive: props.isActive } : {}),
              ...(props.pageNumber != null
                ? { pageNumber: props.pageNumber }
                : {}),
              ...(props.pageSize != null ? { pageSize: props.pageSize } : {}),
            },
          };
        },
      }),

      getBankById: query<IPromoBankDetailsDto, ArgsType>({
        query: ({ id }) => ({
          url: `${endPoints.banks().pathname}/${id}`,
          method: "GET",
        }),
        keepUnusedDataFor: 0,
      }),

      createBank: mutation<unknown, FormData>({
        invalidatesTags: [TAG_NAME],
        query: (data) => ({
          url: endPoints.banks().pathname,
          method: "POST",
          data,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      }),

      updateBank: mutation<unknown, { id: string; data: FormData }>({
        invalidatesTags: [TAG_NAME],
        query: ({ id, data }) => ({
          url: `${endPoints.banks().pathname}/${id}`,
          method: "PUT",
          data,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      }),

      deleteBank: mutation<unknown, string>({
        invalidatesTags: [TAG_NAME],
        query: (id) => ({
          url: `${endPoints.banks().pathname}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });

export const {
  useGetAllBanksQuery,
  useGetBankByIdQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} = banksService;

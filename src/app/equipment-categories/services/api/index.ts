import { api } from 'src/redux-config/store';
import { endPoints } from 'src/shared/end-points';
import { ArgsType } from 'src/types';

export type equipmentCategoriesType = {
  id: string;
  nameAr: string;
  nameEn: string;
  iconUrl: string;
  isActive: boolean;
  createdOn: string;
  createdByName: string;
  lastModifiedByName: string;
  lastModifiedOn: string;
};

type ResType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: equipmentCategoriesType[];
};

type equipmentCategoriesById = {};

const apiService = api.enhanceEndpoints({ addTagTypes: ['equipment-categories'] }).injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAllEquipmentCategories: query<ResType, ArgsType>({
      providesTags: ['equipment-categories'],
      query: (props) => {
        return {
          url: endPoints.equipmentCategoriesEndpoint().pathname + '/search',
          data: props,
          method: 'POST',
        };
      },
    }),
    addEquipmentCategories: mutation<void, any>({
      invalidatesTags: ['equipment-categories'],
      query: (data) => ({
        url: endPoints.equipmentCategoriesEndpoint().pathname,
        method: 'POST',
        data,
      }),
    }),
    editEquipmentCategories: mutation<void, any>({
      invalidatesTags: ['equipment-categories'],
      query: ({ data, id, isActive }) => ({
        url: `${endPoints.equipmentCategoriesEndpoint().pathname}/${isActive ? 'active/' : ''}${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteEquipmentCategories: mutation({
      invalidatesTags: ['equipment-categories'],

      query: (id) => ({
        url: `${endPoints.equipmentCategoriesEndpoint().pathname}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
export const { useAddEquipmentCategoriesMutation, useDeleteEquipmentCategoriesMutation, useEditEquipmentCategoriesMutation, useGetAllEquipmentCategoriesQuery } = apiService;

import { api } from 'src/redux-config/store';
import { endPoints } from 'src/shared/end-points';
import { ArgsType } from 'src/types';
import {IConfigurationDetailsDto, IConfigurationListDto } from 'src/types/modules/nutriplan/configuration';

const apiService = api.enhanceEndpoints({ addTagTypes: ['Configuration'] }).injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAllConfiguration: query<IConfigurationListDto, void>({
      providesTags: ['Configuration'],
      query: () => {
        return {
          url: `${endPoints.configurationEndpoint().pathname}`,  method: 'GET', };
      },
    }),
    addConfiguration: mutation<void, any>({
      invalidatesTags: ['Configuration'],
      query: (data) => ({
        url: endPoints.configurationEndpoint().pathname,
        method: 'PUT',
        data,
      }),
    }),
    editConfiguration: mutation<void, any>({
      invalidatesTags: ['Configuration'],

      query: ({ data, id }) => ({
        url: `${endPoints.configurationEndpoint().pathname}/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    updateActiveConfiguration: mutation({
      invalidatesTags: ['Configuration'],
      query: (id) => ({
        url: `${endPoints.configurationEndpoint().pathname}/active/${id}`,
        method: 'PUT',
      }),
    }),
    getConfiguration: query<IConfigurationDetailsDto, ArgsType>({
      query: ({ id }) => ({
        url: `${endPoints.configurationEndpoint().pathname}/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0, // Disable caching
    }),
    deleteConfiguration: mutation({
      invalidatesTags: ['Configuration'],
      query: (id) => ({
        url: `${endPoints.configurationEndpoint().pathname}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
export const { useGetAllConfigurationQuery,
  useGetConfigurationQuery,
  useDeleteConfigurationMutation,
  useEditConfigurationMutation,
  useAddConfigurationMutation,
  useUpdateActiveConfigurationMutation } =
  apiService;

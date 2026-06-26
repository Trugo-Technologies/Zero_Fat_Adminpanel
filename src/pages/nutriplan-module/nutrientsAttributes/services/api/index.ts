import { api } from 'src/redux-config/store';
import { endPoints } from 'src/shared/end-points';
import { ArgsType } from 'src/types';
import { INutrientsAttributesDetailsDto, INutrientsAttributesListDto } from 'src/types/modules/nutriplan/nutrientsAttributes';

const apiService = api.enhanceEndpoints({ addTagTypes: ['nutrientsAttributes'] }).injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAllNutrientsAttributes: query<INutrientsAttributesListDto, ArgsType>({
      providesTags: ['nutrientsAttributes'],
      query: (props) => {
        return {
          url: `${endPoints.nutrientsAttributes().pathname}/search`,
          method: 'POST',
          data: props,
        };
      },
    }),
    addNutrientsAttribute: mutation<void, any>({
      invalidatesTags: ['nutrientsAttributes'],
      query: (data) => ({
        url: endPoints.nutrientsAttributes().pathname,
        method: 'POST',
        data,
      }),
    }),
    editNutrientsAttribute: mutation<void, any>({
      invalidatesTags: ['nutrientsAttributes'],

      query: ({ data, id }) => ({
        url: `${endPoints.nutrientsAttributes().pathname}/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    updateActiveNutrientsAttribute: mutation({
      invalidatesTags: ['nutrientsAttributes'],
      query: (id) => ({
        url: `${endPoints.nutrientsAttributes().pathname}/active/${id}`,
        method: 'PUT',
      }),
    }),
    getNutrientsAttribute: query<INutrientsAttributesDetailsDto, ArgsType>({
      query: ({ id }) => ({
        url: `${endPoints.nutrientsAttributes().pathname}/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0, // Disable caching
    }),
    deleteNutrientsAttribute: mutation({
      invalidatesTags: ['nutrientsAttributes'],
      query: (id) => ({
        url: `${endPoints.nutrientsAttributes().pathname}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
export const {
   useGetAllNutrientsAttributesQuery,
  useGetNutrientsAttributeQuery,
  useDeleteNutrientsAttributeMutation,
  useEditNutrientsAttributeMutation,
  useAddNutrientsAttributeMutation,
  useUpdateActiveNutrientsAttributeMutation } =
  apiService;

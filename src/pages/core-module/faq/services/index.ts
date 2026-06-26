import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
import { IFaqDetails, IFaqListDto } from "src/types/modules/core/faq";

const service = api.enhanceEndpoints({ addTagTypes: ["Faq"] }).injectEndpoints({
  endpoints: ({ mutation, query }) => ({
    getAllFaq: query<IFaqListDto, ArgsType>({
      providesTags: ["Faq"],
      query: (data) => ({
        url: endPoints.faqEndpoint().pathname + "/search",
        method: "POST",
        data,
      }),
    }),
    addFaq: mutation({
      invalidatesTags: ["Faq"],
      query: (data) => ({
        url: endPoints.faqEndpoint().pathname,
        method: "POST",
        data,
      }),
    }),
    editFaq: mutation({
      invalidatesTags: ["Faq"],
      query: ({ id, data, isActive }) => ({
        url:
          endPoints.faqEndpoint().pathname +
          `${isActive ? "/active" : ""}/${id}`,
        method: "PUT",
        data,
      }),
    }),

    deleteFaq: mutation({
      invalidatesTags: ["Faq"],
      query: (id) => ({
        url: endPoints.faqEndpoint().pathname + `/${id}`,
        method: "DELETE",
      }),
    }),

    updateActiveFaq: mutation({
      invalidatesTags: ["Faq"],
      query: (id) => ({
        url: `${endPoints.faqEndpoint().pathname}/active/${id}`,
        method: "PUT",
      }),
    }),

    getFaqDetails: query<IFaqDetails, ArgsType>({
      query: ({ id }) => ({
        url: `${endPoints.faqEndpoint().pathname}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Disable caching
    }),
  }),
});
export const {
  useAddFaqMutation,
  useDeleteFaqMutation,
  useEditFaqMutation,
  useGetAllFaqQuery,
  useGetFaqDetailsQuery,
  useUpdateActiveFaqMutation,
} = service;

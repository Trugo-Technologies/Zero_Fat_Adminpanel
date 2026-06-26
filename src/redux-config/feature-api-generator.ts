import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { authAxios } from 'src/config/axios';
import { baseUrl } from 'src/env/base-url';
import { AxiosRequestConfig, AxiosError, AxiosRequestHeaders } from 'axios';
import { settings } from 'src/config/settings';
const errorsCode = ['ERR_BAD_RESPONSE', 'ERR_NETWORK', 'ERR_BAD_REQUEST'];
//parameter types
type propsType = {
  name: string;
  tagTypes?: string[]; // Optional tagTypes
};

/// the axios configuration for RTk query
const axiosBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
  }): BaseQueryFn<
    {
      url: string;
      method?: (AxiosRequestConfig['method'] & 'POST') | 'PATCH' | 'DELETE' | 'GET' | 'PUT';
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    // try {
    const result = await authAxios({
      url: baseUrl + '/api' + url,
      data,
      params,
      headers,
      method,
    })
      .then((res) => res)
      .catch((err) => {
        return { error: err };
      });

    if ((result as any).name === 'AxiosError')
      return {
        error: result,
      };
    else return result;
  };

// the api generator
export const featureApiGenerator = ({ name, tagTypes = [] }: propsType) => {
  const api = createApi({
    reducerPath: name,
    baseQuery: axiosBaseQuery({
      baseUrl: baseUrl,
    }),

    keepUnusedDataFor: settings.staleDataBeforeReFetching,
    tagTypes: tagTypes, // Use 'as const' for literal type inference

    endpoints: () => ({}),
  });
  return api;
};

/** @format */

import { getValueBasedOnCurrentLanguage } from "src/Helpers";
/** @format */

import axios, { AxiosError } from "axios";
import { LanguageProps } from "src/@crema/types/models/Apps";
// import i18next from "i18next";
import { showErrorToasts } from "src/Components/toasts";
import { IErrorResponse } from "src/types/baseEntity";

export const authAxios = axios.create();
type errorResponse = {
  errors: Array<string>;

  status: number;
  title: string;
  // error: {
  //   code: number | string;
  //   message: [
  //     {
  //       message: string;
  //       path: string;
  //     },
  //   ];
};

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        if ((error?.response?.data as IErrorResponse)?.errors) {
          showErrorToasts(
            (error?.response?.data as IErrorResponse)?.errors.join(", ")
          );
        } else if ((error?.response?.data as IErrorResponse)?.title) {
          showErrorToasts((error?.response?.data as IErrorResponse)?.title);
        } else {
          showErrorToasts(
            getValueBasedOnCurrentLanguage(
              "لقد حدث خطأ ما، أعد المحاولة من فضلك!",
              "Something went wrong, Please try again!"
            )
          );
        }
      }
      return Promise.reject(error);
    }
    ///catch all errors from here

    // else showErrorToasts('network error');

    return Promise.reject(error);
  }
);

//add your headers here
// authAxios.interceptors.request.use((config: any) => {
//   config.headers['Authorization'] = store.getState().auth.token ? `Bearer ${store.getState().auth.token} ` : '';
//   return config;
// });

export const setToken = (token?: string) => {
  if (token) {
    authAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete authAxios.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

export const setLanguage = (language: LanguageProps) => {
  if (language) {
    // Set the language in the Axios headers
    authAxios.defaults.headers.common["Accept-Language"] = language.locale;
  } else {
    // Remove the language header if no language is provided
    delete authAxios.defaults.headers.common["Accept-Language"];
  }
};

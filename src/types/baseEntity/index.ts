/** @format */

import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IBaseResponseListDto<T> {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: Array<T>;
}
export interface IBaseUpdateDto {
  id: string;
}

interface AxiosError extends Error {
  config: AxiosRequestConfig; // The configuration for the request that generated the error
  code?: string; // Error code (e.g., "ERR_BAD_REQUEST")
  request: XMLHttpRequest; // The XMLHttpRequest object for the request
  response?: AxiosResponse<IErrorResponse>; // The response object (if available)
  isAxiosError: boolean; // A flag indicating that the error is from Axios
}

export interface IErrorResponse {
  type: string; // URL to the specification
  title: string; // Error title/message
  status: number; // HTTP status code
  instance: string; // The instance of the request
  errors: string[]; // Array of validation error messages
  messages: string[];
}
export interface IBaseErrorResponse {
  error: AxiosError;
}
export interface IBaseResponse {
  succeeded: boolean;
  messages: Array<string>;
}

export interface IBaseResponse {
  succeeded: boolean;
  messages: Array<string>;
}

export interface IBaseResponseDetailsDto<T> extends IBaseResponse {
  data: T;
}
export interface IBaseAdditionalResponseDetailsDto {
  createdBy: string;
  createdOn: string;
  createdByName: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  lastModifiedByName: string;
  deletedOn: string;
  deletedBy: string;
  deletedByName: string;
  activationChangedOn: string;
  activationChangedByName: string;
  activationChangedBy: string;
}

export interface ISelectedRow {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface IActiveAllPayload {
  ids: string[];
  isActive: boolean;
}

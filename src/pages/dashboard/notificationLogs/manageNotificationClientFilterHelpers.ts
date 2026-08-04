/** @format */

import {
  ALL_DIETITIAN_GOALS,
  ALL_GENDERS,
  ALL_STATUS,
  ALL_SUBSCRIPTION_STATUS,
  dateInputSx,
  selectSx,
} from "src/pages/clients-module/clients/clientFilterHelpers";
import { IManageNotificationClientsArgs } from "src/types/modules/dashboard/notifications";

export const ALL_PERIODS = "All Time";

export {
  ALL_GENDERS,
  ALL_DIETITIAN_GOALS,
  ALL_SUBSCRIPTION_STATUS,
  ALL_STATUS,
  dateInputSx,
  selectSx,
};

export const PERIOD_OPTIONS = [
  { value: "Weekly", labelKey: "common.weekly" },
  { value: "Monthly", labelKey: "common.monthly" },
  { value: "Yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export type ManageNotificationPeriod =
  | typeof ALL_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type ManageNotificationClientFilters = {
  status: string;
  gender: string;
  dietitianGoal: string;
  subscriptionStatus: string;
  period: ManageNotificationPeriod;
  fromDate: string;
  toDate: string;
};

export const createDefaultManageNotificationClientFilters =
  (): ManageNotificationClientFilters => ({
    status: ALL_STATUS,
    gender: ALL_GENDERS,
    dietitianGoal: ALL_DIETITIAN_GOALS,
    subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
    period: ALL_PERIODS,
    fromDate: "",
    toDate: "",
  });

export const buildManageNotificationClientQueryParams = (
  filters: ManageNotificationClientFilters
) => {
  const params: {
    isActive?: boolean;
    gender?: string;
    dietitianGoal?: string;
    subscriptionStatus?: string;
    period?: string;
    fromDate?: string;
    toDate?: string;
  } = {};

  if (filters.status === "Active") {
    params.isActive = true;
  } else if (filters.status === "Inactive") {
    params.isActive = false;
  }

  if (filters.gender !== ALL_GENDERS) {
    params.gender = filters.gender;
  }
  if (filters.dietitianGoal !== ALL_DIETITIAN_GOALS) {
    params.dietitianGoal = filters.dietitianGoal;
  }
  if (filters.subscriptionStatus !== ALL_SUBSCRIPTION_STATUS) {
    params.subscriptionStatus = filters.subscriptionStatus;
  }

  if (
    filters.period === "Weekly" ||
    filters.period === "Monthly" ||
    filters.period === "Yearly"
  ) {
    params.period = filters.period;
  }

  if (filters.period === "custom") {
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
  }

  return params;
};

/** Builds GET query params for `/ManageNotifications/clients`. */
export const buildManageNotificationClientsRequest = (
  params: Record<string, unknown>
): IManageNotificationClientsArgs => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : "";

  const request: IManageNotificationClientsArgs = {
    pageNumber:
      typeof params.pageNumber === "number" && params.pageNumber > 0
        ? params.pageNumber
        : 1,
    pageSize:
      typeof params.pageSize === "number" && params.pageSize > 0
        ? params.pageSize
        : 10,
  };

  if (search) {
    request.search = search;
  }

  if (typeof params.isActive === "boolean") {
    request.isActive = params.isActive;
  }

  if (typeof params.gender === "string" && params.gender) {
    request.gender = params.gender;
  }

  if (typeof params.subscriptionStatus === "string" && params.subscriptionStatus) {
    request.subscriptionStatus = params.subscriptionStatus;
  }

  if (typeof params.dietitianGoal === "string" && params.dietitianGoal) {
    request.dietitianGoal = params.dietitianGoal;
  }

  if (typeof params.period === "string" && params.period) {
    request.period = params.period;
  }

  if (typeof params.fromDate === "string" && params.fromDate) {
    request.fromDate = params.fromDate;
  }

  if (typeof params.toDate === "string" && params.toDate) {
    request.toDate = params.toDate;
  }

  return request;
};

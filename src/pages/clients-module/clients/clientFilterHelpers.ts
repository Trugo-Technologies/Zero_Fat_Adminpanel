/** @format */

import { dietitianGoal, gender } from "src/types/enums";
import { resolveClientFilterDateRange } from "./clientDatePeriodFilter";

export const ALL_GENDERS = "All Genders";
export const ALL_DIETITIAN_GOALS = "All Dietitian Goals";
export const ALL_STATUS = "All Status";
export const ALL_IS_ACTIVE = "All Active Status";
export const ALL_SUBSCRIPTION_STATUS = "All Subscription Status";
export const ALL_HAS_SUBSCRIPTION = "All Subscription Presence";
export const ALL_ACCOUNT_DELETED = "All Account Deleted";
export const ALL_BLOCK_OPTIONS = "All Block Options";
export const ALL_EXPORT_PERIODS = "All Time";

export const EXPORT_PERIOD_OPTIONS = [
  { value: "Weekly", labelKey: "common.weekly" },
  { value: "Monthly", labelKey: "common.monthly" },
  { value: "Yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export const SUBSCRIPTION_STATUS_EXPORT_OPTIONS = [
  { value: "Active", labelKey: "clients.export.subscriptionStatus.Active" },
  { value: "PastDue", labelKey: "clients.export.subscriptionStatus.PastDue" },
  { value: "Canceled", labelKey: "clients.export.subscriptionStatus.Canceled" },
  { value: "Expired", labelKey: "clients.export.subscriptionStatus.Expired" },
  { value: "Pending", labelKey: "clients.export.subscriptionStatus.Pending" },
  { value: "Unknown", labelKey: "clients.export.subscriptionStatus.Unknown" },
] as const;

export const LIST_SUBSCRIPTION_STATUS_OPTIONS = [
  {
    value: "Active",
    labelKey: "clients.export.subscriptionStatus.Active",
  },
  {
    value: "PastDue",
    labelKey: "clients.export.subscriptionStatus.PastDue",
  },
  {
    value: "Canceled",
    labelKey: "clients.export.subscriptionStatus.Canceled",
  },
  {
    value: "Expired",
    labelKey: "clients.export.subscriptionStatus.Expired",
  },
  {
    value: "Pending",
    labelKey: "clients.export.subscriptionStatus.Pending",
  },
  {
    value: "Unknown",
    labelKey: "clients.export.subscriptionStatus.Unknown",
  },
  {
    value: "NoSubscription",
    labelKey: "clients.subscriptionStatus.NoSubscription",
  },
] as const;

export const BLOCK_OPTION_OPTIONS = [
  { value: "0", labelKey: "clients.filter.blockOption.none" },
  { value: "1", labelKey: "clients.filter.blockOption.oneDay" },
  { value: "2", labelKey: "clients.filter.blockOption.custom" },
  { value: "3", labelKey: "clients.filter.blockOption.permanent" },
] as const;

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const DATE_PERIOD_OPTIONS = [
  { value: "weekly", labelKey: "common.weekly" },
  { value: "monthly", labelKey: "common.monthly" },
  { value: "yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export const GENDER_OPTIONS = [
  { value: gender.Male, labelKey: "common.gender.Male" },
  { value: gender.Female, labelKey: "common.gender.Female" },
] as const;

export const DIETITIAN_GOAL_OPTIONS = [
  {
    value: dietitianGoal.GeneralHealth,
    labelKey: "clients.dietitianGoal.GeneralHealth",
  },
  {
    value: dietitianGoal.LoseWeight,
    labelKey: "clients.dietitianGoal.LoseWeight",
  },
  {
    value: dietitianGoal.GainWeight,
    labelKey: "clients.dietitianGoal.GainWeight",
  },
  { value: dietitianGoal.LoseFat, labelKey: "clients.dietitianGoal.LoseFat" },
  {
    value: dietitianGoal.BuildMuscles,
    labelKey: "clients.dietitianGoal.BuildMuscles",
  },
] as const;

export type ClientExportPeriod =
  | typeof ALL_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type ClientAppliedFilters = {
  gender: string;
  dietitianGoal: string;
  status: string;
  subscriptionStatus: string;
  period: ClientExportPeriod;
  fromDate: string;
  toDate: string;
};

export type ClientExportFilters = {
  isActive: string;
  gender: string;
  subscriptionStatus: string;
  dietitianGoal: string;
  period: ClientExportPeriod;
  fromDate: string;
  toDate: string;
};

export const createDefaultClientFilters = (): ClientAppliedFilters => ({
  gender: ALL_GENDERS,
  dietitianGoal: ALL_DIETITIAN_GOALS,
  status: ALL_STATUS,
  subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
  period: ALL_EXPORT_PERIODS,
  fromDate: "",
  toDate: "",
});

export const createDefaultClientExportFilters = (): ClientExportFilters => ({
  isActive: ALL_IS_ACTIVE,
  gender: ALL_GENDERS,
  subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
  dietitianGoal: ALL_DIETITIAN_GOALS,
  period: ALL_EXPORT_PERIODS,
  fromDate: "",
  toDate: "",
});

export const buildClientFilterQueryParams = (filters: ClientAppliedFilters) => {
  const { fromDate, toDate } = resolveClientFilterDateRange(
    filters.period,
    filters.fromDate,
    filters.toDate
  );

  return {
    gender: filters.gender === ALL_GENDERS ? undefined : filters.gender,
    dietitianGoal:
      filters.dietitianGoal === ALL_DIETITIAN_GOALS
        ? undefined
        : filters.dietitianGoal,
    isActive:
      filters.status === "Active"
        ? true
        : filters.status === "Inactive"
          ? false
          : undefined,
    subscriptionStatus:
      filters.subscriptionStatus === ALL_SUBSCRIPTION_STATUS
        ? undefined
        : filters.subscriptionStatus,
    period:
      filters.period === "Weekly" ||
      filters.period === "Monthly" ||
      filters.period === "Yearly"
        ? filters.period
        : undefined,
    fromDate,
    toDate,
  };
};

export type ClientsFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  isActive?: boolean;
  gender?: string;
  subscriptionStatus?: string;
  dietitianGoal?: string;
  period?: string;
  fromDate?: string;
  toDate?: string;
};

/** Builds GET query params for `/Clients/filter`. */
export const buildClientsFilterRequest = (
  params: Record<string, unknown>
): ClientsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: ClientsFilterRequest = {
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

export const buildClientExportParams = (
  filters: ClientExportFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.isActive === "true" || filters.isActive === "false") {
    params.isActive = filters.isActive;
  }
  if (filters.gender !== ALL_GENDERS) {
    params.gender = filters.gender;
  }
  if (filters.subscriptionStatus !== ALL_SUBSCRIPTION_STATUS) {
    params.subscriptionStatus = filters.subscriptionStatus;
  }
  if (filters.dietitianGoal !== ALL_DIETITIAN_GOALS) {
    params.dietitianGoal = filters.dietitianGoal;
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

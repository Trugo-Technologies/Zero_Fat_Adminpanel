/** @format */

import { paymentStatus, subscriptionType } from "src/types/enums";
import { resolveClientFilterDateRange } from "../clients/clientDatePeriodFilter";

export const ALL_SUBSCRIPTION_TYPES = "All Subscription Types";
export const ALL_SUBSCRIPTION_STATUS = "All Subscription Status";
export const ALL_PAYMENT_STATUS = "All Payment Status";
export const ALL_EXPORT_PERIODS = "All Time";
export const ALL_EXPORT_SUBSCRIPTION_STATUS = "All Subscription Status";
export const ALL_CLIENT_SUBSCRIPTION_EXPORT_TYPE = "";

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

export const SUBSCRIPTION_TYPE_OPTIONS = [
  {
    value: subscriptionType.OneWeek,
    labelKey: "subscriptionPlans.subscriptionType.OneWeek",
  },
  {
    value: subscriptionType.OneMonth,
    labelKey: "subscriptionPlans.subscriptionType.OneMonth",
  },
  {
    value: subscriptionType.ThreeMonths,
    labelKey: "subscriptionPlans.subscriptionType.ThreeMonths",
  },
] as const;

export const LIST_SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "Active", labelKey: "clients.export.subscriptionStatus.Active" },
  { value: "PastDue", labelKey: "clients.export.subscriptionStatus.PastDue" },
  { value: "Canceled", labelKey: "clients.export.subscriptionStatus.Canceled" },
  { value: "Expired", labelKey: "clients.export.subscriptionStatus.Expired" },
  { value: "Pending", labelKey: "clients.export.subscriptionStatus.Pending" },
  { value: "Unknown", labelKey: "clients.export.subscriptionStatus.Unknown" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: paymentStatus.Pending, labelKey: "payments.paymentStatus.Pending" },
  { value: paymentStatus.Paid, labelKey: "payments.paymentStatus.Paid" },
  { value: paymentStatus.Failed, labelKey: "payments.paymentStatus.Failed" },
  { value: paymentStatus.Refunded, labelKey: "payments.paymentStatus.Refunded" },
  {
    value: paymentStatus.Cancelled,
    labelKey: "payments.paymentStatus.Cancelled",
  },
  {
    value: paymentStatus.PartiallyPaid,
    labelKey: "payments.paymentStatus.PartiallyPaid",
  },
] as const;

export const EXPORT_SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "Active", labelKey: "clients.export.subscriptionStatus.Active" },
  { value: "PastDue", labelKey: "clients.export.subscriptionStatus.PastDue" },
  { value: "Canceled", labelKey: "clients.export.subscriptionStatus.Canceled" },
  { value: "Expired", labelKey: "clients.export.subscriptionStatus.Expired" },
  { value: "Pending", labelKey: "clients.export.subscriptionStatus.Pending" },
  { value: "Unknown", labelKey: "clients.export.subscriptionStatus.Unknown" },
] as const;

export const EXPORT_PERIOD_OPTIONS = [
  { value: "Weekly", labelKey: "common.weekly" },
  { value: "Monthly", labelKey: "common.monthly" },
  { value: "Yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export const CLIENT_SUBSCRIPTION_EXPORT_TYPE_OPTIONS = [
  { value: "new", labelKey: "clientSubscriptions.export.type.new" },
  { value: "renew", labelKey: "clientSubscriptions.export.type.renew" },
] as const;

export type ClientSubscriptionExportType = "" | "new" | "renew";

export type ClientSubscriptionExportPeriod =
  | typeof ALL_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type ClientSubscriptionAppliedFilters = {
  period: ClientSubscriptionExportPeriod;
  fromDate: string;
  toDate: string;
  startDateFrom: string;
  startDateTo: string;
  endDateFrom: string;
  endDateTo: string;
  subscriptionType: string;
  subscriptionStatus: string;
  paymentStatus: string;
};

export type ClientSubscriptionExportFilters = {
  exportType: ClientSubscriptionExportType;
  paymentStatus: string;
  subscriptionStatus: string;
  period: ClientSubscriptionExportPeriod;
  fromDate: string;
  toDate: string;
};

export const createDefaultClientSubscriptionFilters =
  (): ClientSubscriptionAppliedFilters => ({
    period: ALL_EXPORT_PERIODS,
    fromDate: "",
    toDate: "",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    subscriptionType: ALL_SUBSCRIPTION_TYPES,
    subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
    paymentStatus: ALL_PAYMENT_STATUS,
  });

export const createDefaultClientSubscriptionExportFilters =
  (): ClientSubscriptionExportFilters => ({
    exportType: ALL_CLIENT_SUBSCRIPTION_EXPORT_TYPE,
    paymentStatus: ALL_PAYMENT_STATUS,
    subscriptionStatus: ALL_EXPORT_SUBSCRIPTION_STATUS,
    period: ALL_EXPORT_PERIODS,
    fromDate: "",
    toDate: "",
  });

export const buildClientSubscriptionFilterQueryParams = (
  filters: ClientSubscriptionAppliedFilters
) => {
  const { fromDate, toDate } = resolveClientFilterDateRange(
    filters.period,
    filters.fromDate,
    filters.toDate
  );

  return {
    period:
      filters.period === "Weekly" ||
      filters.period === "Monthly" ||
      filters.period === "Yearly"
        ? filters.period
        : undefined,
    fromDate,
    toDate,
    startDateFrom: filters.startDateFrom || undefined,
    startDateTo: filters.startDateTo || undefined,
    endDateFrom: filters.endDateFrom || undefined,
    endDateTo: filters.endDateTo || undefined,
    subscriptionType:
      filters.subscriptionType === ALL_SUBSCRIPTION_TYPES
        ? undefined
        : filters.subscriptionType,
    subscriptionStatus:
      filters.subscriptionStatus === ALL_SUBSCRIPTION_STATUS
        ? undefined
        : filters.subscriptionStatus,
    paymentStatus:
      filters.paymentStatus === ALL_PAYMENT_STATUS
        ? undefined
        : filters.paymentStatus,
  };
};

export type ClientSubscriptionsFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  subscriptionStatus?: string;
  paymentStatus?: string;
  subscriptionType?: string;
  period?: string;
  fromDate?: string;
  toDate?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  clientId?: string;
};

/** Builds GET query params for `/ClientSubscriptions/filter`. */
export const buildClientSubscriptionsFilterRequest = (
  params: Record<string, unknown>
): ClientSubscriptionsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: ClientSubscriptionsFilterRequest = {
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

  if (typeof params.clientId === "string" && params.clientId) {
    request.clientId = params.clientId;
  }

  const stringKeys = [
    "subscriptionStatus",
    "paymentStatus",
    "subscriptionType",
    "period",
    "fromDate",
    "toDate",
    "startDateFrom",
    "startDateTo",
    "endDateFrom",
    "endDateTo",
  ] as const;

  for (const key of stringKeys) {
    const value = params[key];
    if (typeof value === "string" && value) {
      request[key] = value;
    }
  }

  return request;
};

export const buildClientSubscriptionExportParams = (
  filters: ClientSubscriptionExportFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.paymentStatus !== ALL_PAYMENT_STATUS) {
    params.paymentStatus = filters.paymentStatus;
  }
  if (filters.subscriptionStatus !== ALL_EXPORT_SUBSCRIPTION_STATUS) {
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

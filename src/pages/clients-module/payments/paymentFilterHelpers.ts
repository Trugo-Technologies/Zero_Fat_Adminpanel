/** @format */

import { paymentStatus } from "src/types/enums";
import {
  ALL_DATE_PERIODS,
  resolveClientFilterDateRange,
} from "../clients/clientDatePeriodFilter";

export const ALL_PAYMENT_GATEWAYS = "All Payment Gateways";
export const ALL_PAYMENT_METHODS = "All Payment Methods";
export const ALL_PAYMENT_STATUS = "All Payment Status";
export const ALL_PAYMENT_EXPORT_PERIODS = "All Time";
export const ALL_IS_DISCOUNT_APPLIED = "All";

export { ALL_DATE_PERIODS };

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

export const numberInputSx = {
  ...dateInputSx,
  minWidth: 120,
};

export const PAYMENT_GATEWAY_OPTIONS = [
  { value: "Stripe", labelKey: "payments.paymentGateway.Stripe" },
  { value: "Tamara", labelKey: "payments.paymentGateway.Tamara" },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: "Card", labelKey: "payments.paymentMethod.Card" },
  { value: "Online", labelKey: "payments.paymentMethod.Online" },
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

export const PAYMENT_EXPORT_PERIOD_OPTIONS = [
  { value: "Weekly", labelKey: "common.weekly" },
  { value: "Monthly", labelKey: "common.monthly" },
  { value: "Yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

/** List + export shared period values (API: Weekly, Monthly, Yearly). */
export type PaymentExportPeriod =
  | typeof ALL_PAYMENT_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type DatePeriod = PaymentExportPeriod;

export type PaymentAppliedFilters = {
  paymentGateway: string;
  paymentMethod: string;
  paymentStatus: string;
  period: PaymentExportPeriod;
  fromDate: string;
  toDate: string;
  amountMin: string;
  amountMax: string;
};

export type PaymentExportFilters = {
  paymentStatus: string;
  period: PaymentExportPeriod;
  fromDate: string;
  toDate: string;
  minAmount: string;
  maxAmount: string;
  isDiscountApplied: string;
  paymentMethod: string;
  paymentGateway: string;
};

export const createDefaultPaymentFilters = (): PaymentAppliedFilters => ({
  paymentGateway: ALL_PAYMENT_GATEWAYS,
  paymentMethod: ALL_PAYMENT_METHODS,
  paymentStatus: ALL_PAYMENT_STATUS,
  period: ALL_PAYMENT_EXPORT_PERIODS,
  fromDate: "",
  toDate: "",
  amountMin: "",
  amountMax: "",
});

export const createDefaultPaymentExportFilters = (): PaymentExportFilters => ({
  paymentStatus: ALL_PAYMENT_STATUS,
  period: ALL_PAYMENT_EXPORT_PERIODS,
  fromDate: "",
  toDate: "",
  minAmount: "",
  maxAmount: "",
  isDiscountApplied: ALL_IS_DISCOUNT_APPLIED,
  paymentMethod: ALL_PAYMENT_METHODS,
  paymentGateway: ALL_PAYMENT_GATEWAYS,
});

export const buildPaymentFilterQueryParams = (
  filters: PaymentAppliedFilters
) => {
  const { fromDate, toDate } = resolveClientFilterDateRange(
    filters.period,
    filters.fromDate,
    filters.toDate
  );

  return {
    paymentGateway:
      filters.paymentGateway === ALL_PAYMENT_GATEWAYS
        ? undefined
        : filters.paymentGateway,
    paymentMethod:
      filters.paymentMethod === ALL_PAYMENT_METHODS
        ? undefined
        : filters.paymentMethod,
    paymentStatus:
      filters.paymentStatus === ALL_PAYMENT_STATUS
        ? undefined
        : filters.paymentStatus,
    period:
      filters.period === "Weekly" ||
      filters.period === "Monthly" ||
      filters.period === "Yearly"
        ? filters.period
        : undefined,
    fromDate,
    toDate,
    amountMin: filters.amountMin || undefined,
    amountMax: filters.amountMax || undefined,
  };
};

export type PaymentsFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  paymentStatus?: string;
  paymentGateway?: string;
  paymentMethod?: string;
  amountMin?: number | string;
  amountMax?: number | string;
  period?: string;
  fromDate?: string;
  toDate?: string;
  clientId?: string;
};

/** Builds GET query params for `/Payments/filter`. */
export const buildPaymentsFilterRequest = (
  params: Record<string, unknown>
): PaymentsFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: PaymentsFilterRequest = {
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

  if (typeof params.paymentStatus === "string" && params.paymentStatus) {
    request.paymentStatus = params.paymentStatus;
  }

  if (typeof params.paymentGateway === "string" && params.paymentGateway) {
    request.paymentGateway = params.paymentGateway;
  }

  if (typeof params.paymentMethod === "string" && params.paymentMethod) {
    request.paymentMethod = params.paymentMethod;
  }

  if (
    (typeof params.amountMin === "string" && params.amountMin) ||
    typeof params.amountMin === "number"
  ) {
    request.amountMin = params.amountMin;
  }

  if (
    (typeof params.amountMax === "string" && params.amountMax) ||
    typeof params.amountMax === "number"
  ) {
    request.amountMax = params.amountMax;
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

export const buildPaymentExportParams = (
  filters: PaymentExportFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.paymentStatus !== ALL_PAYMENT_STATUS) {
    params.paymentStatus = filters.paymentStatus;
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
  if (filters.minAmount) params.minAmount = filters.minAmount;
  if (filters.maxAmount) params.maxAmount = filters.maxAmount;
  if (
    filters.isDiscountApplied === "true" ||
    filters.isDiscountApplied === "false"
  ) {
    params.isDiscountApplied = filters.isDiscountApplied;
  }
  if (filters.paymentMethod !== ALL_PAYMENT_METHODS) {
    params.paymentMethod = filters.paymentMethod;
  }
  if (filters.paymentGateway !== ALL_PAYMENT_GATEWAYS) {
    params.paymentGateway = filters.paymentGateway;
  }

  return params;
};

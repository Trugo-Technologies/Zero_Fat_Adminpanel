/** @format */

import { Duration } from "src/types/modules/clientsManagement/discounts/discountRules";

export const ALL_DURATIONS = "All Durations";
export const ALL_STATUS = "All Status";

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

export const DURATION_OPTIONS = [
  { value: Duration.Once, labelKey: "discountRules.duration.Once" },
  { value: Duration.Repeating, labelKey: "discountRules.duration.Repeating" },
  { value: Duration.Forever, labelKey: "discountRules.duration.Forever" },
] as const;

export type DiscountRuleAppliedFilters = {
  startDateFrom: string;
  startDateTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
  duration: string;
  status: string;
};

export const createDefaultDiscountRuleFilters =
  (): DiscountRuleAppliedFilters => ({
    startDateFrom: "",
    startDateTo: "",
    expirationDateFrom: "",
    expirationDateTo: "",
    duration: ALL_DURATIONS,
    status: ALL_STATUS,
  });

export const buildDiscountRuleFilterQueryParams = (
  filters: DiscountRuleAppliedFilters
) => ({
  startDateFrom: filters.startDateFrom || undefined,
  startDateTo: filters.startDateTo || undefined,
  expirationDateFrom: filters.expirationDateFrom || undefined,
  expirationDateTo: filters.expirationDateTo || undefined,
  duration: filters.duration === ALL_DURATIONS ? undefined : filters.duration,
  isActive:
    filters.status === "Active"
      ? true
      : filters.status === "Inactive"
        ? false
        : undefined,
});

export type DiscountRulesFilterRequest = {
  search?: string;
  pageNumber: number;
  pageSize: number;
  startDateFrom?: string;
  startDateTo?: string;
  expirationDateFrom?: string;
  expirationDateTo?: string;
  duration?: string;
  isActive?: boolean;
};

/** Builds GET query params for `/DiscountRules/filter`. */
export const buildDiscountRulesFilterRequest = (
  params: Record<string, unknown>
): DiscountRulesFilterRequest => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : typeof params.searchValue === "string"
          ? params.searchValue.trim()
          : "";

  const request: DiscountRulesFilterRequest = {
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

  if (typeof params.startDateFrom === "string" && params.startDateFrom) {
    request.startDateFrom = params.startDateFrom;
  }

  if (typeof params.startDateTo === "string" && params.startDateTo) {
    request.startDateTo = params.startDateTo;
  }

  if (
    typeof params.expirationDateFrom === "string" &&
    params.expirationDateFrom
  ) {
    request.expirationDateFrom = params.expirationDateFrom;
  }

  if (typeof params.expirationDateTo === "string" && params.expirationDateTo) {
    request.expirationDateTo = params.expirationDateTo;
  }

  if (typeof params.duration === "string" && params.duration) {
    request.duration = params.duration;
  }

  if (typeof params.isActive === "boolean") {
    request.isActive = params.isActive;
  }

  return request;
};

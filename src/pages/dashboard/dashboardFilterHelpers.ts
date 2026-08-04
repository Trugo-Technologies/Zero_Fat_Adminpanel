/** @format */

import {
  ALL_EXPORT_PERIODS,
  EXPORT_PERIOD_OPTIONS,
  selectSx,
  dateInputSx,
} from "src/pages/clients-module/clients/clientFilterHelpers";

export { ALL_EXPORT_PERIODS, EXPORT_PERIOD_OPTIONS, selectSx, dateInputSx };

export type DashboardReportPeriod =
  | typeof ALL_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type DashboardAppliedFilters = {
  period: DashboardReportPeriod;
  fromDate: string;
  toDate: string;
};

export const createDefaultDashboardFilters = (): DashboardAppliedFilters => ({
  period: ALL_EXPORT_PERIODS,
  fromDate: "",
  toDate: "",
});

export type DashboardReportRequest = {
  period?: string;
  fromDate?: string;
  toDate?: string;
};

export const buildDashboardReportQueryParams = (
  filters: DashboardAppliedFilters
): DashboardReportRequest => {
  const request: DashboardReportRequest = {};

  if (
    filters.period === "Weekly" ||
    filters.period === "Monthly" ||
    filters.period === "Yearly"
  ) {
    request.period = filters.period;
    return request;
  }

  if (filters.period === "custom") {
    if (filters.fromDate) {
      request.fromDate = filters.fromDate;
    }
    if (filters.toDate) {
      request.toDate = filters.toDate;
    }
  }

  return request;
};

/** Builds GET query params for dashboard report summary endpoints. */
export const buildDashboardReportRequest = (
  params: Record<string, unknown>
): DashboardReportRequest => {
  const period =
    typeof params.period === "string" && params.period
      ? params.period
      : undefined;
  const fromDate = typeof params.fromDate === "string" ? params.fromDate : "";
  const toDate = typeof params.toDate === "string" ? params.toDate : "";

  // Custom ranges are built as { fromDate, toDate } without period.
  // Previously, missing period defaulted to "All Time" and those dates were dropped.
  if (
    fromDate ||
    toDate ||
    period === "custom"
  ) {
    if (
      !period ||
      period === "custom" ||
      period === ALL_EXPORT_PERIODS
    ) {
      return {
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
      };
    }
  }

  return buildDashboardReportQueryParams({
    period: (period || ALL_EXPORT_PERIODS) as DashboardReportPeriod,
    fromDate,
    toDate,
  });
};

/** @format */

import dayjs from "dayjs";

export const ALL_DATE_PERIODS = "All Time";

export type ClientDatePeriod =
  | typeof ALL_DATE_PERIODS
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type ClientFilterDatePeriod =
  | typeof ALL_DATE_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export const resolveClientDatePeriodRange = (
  period: ClientDatePeriod,
  customStart = "",
  customEnd = ""
): { startDate?: string; endDate?: string } => {
  const today = dayjs();

  switch (period) {
    case "weekly":
      return {
        startDate: today.startOf("week").format("YYYY-MM-DD"),
        endDate: today.endOf("week").format("YYYY-MM-DD"),
      };
    case "monthly":
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "yearly":
      return {
        startDate: today.startOf("year").format("YYYY-MM-DD"),
        endDate: today.endOf("year").format("YYYY-MM-DD"),
      };
    case "custom":
      return {
        startDate: customStart || undefined,
        endDate: customEnd || undefined,
      };
    default:
      return {};
  }
};

/** Resolves `fromDate` / `toDate` for Clients filter GET (`period` + dates). */
export const resolveClientFilterDateRange = (
  period: ClientFilterDatePeriod,
  customFrom = "",
  customTo = ""
): { fromDate?: string; toDate?: string } => {
  const today = dayjs();

  switch (period) {
    case "Weekly":
      return {
        fromDate: today.startOf("week").format("YYYY-MM-DD"),
        toDate: today.endOf("week").format("YYYY-MM-DD"),
      };
    case "Monthly":
      return {
        fromDate: today.startOf("month").format("YYYY-MM-DD"),
        toDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "Yearly":
      return {
        fromDate: today.startOf("year").format("YYYY-MM-DD"),
        toDate: today.endOf("year").format("YYYY-MM-DD"),
      };
    case "custom":
      return {
        fromDate: customFrom || undefined,
        toDate: customTo || undefined,
      };
    default:
      return {};
  }
};

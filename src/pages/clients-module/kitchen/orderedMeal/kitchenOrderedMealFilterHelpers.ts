/** @format */

import { dailySelectionsStatus } from "src/types/enums";

export const ALL_DELIVERY_STATUS = "All Status";
export const ALL_EXPORT_PERIODS = "All Time";

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

export const EXPORT_PERIOD_OPTIONS = [
  { value: "Weekly", labelKey: "common.weekly" },
  { value: "Monthly", labelKey: "common.monthly" },
  { value: "Yearly", labelKey: "common.yearly" },
  { value: "custom", labelKey: "common.customDateRange" },
] as const;

export const DELIVERY_STATUS_OPTIONS = [
  {
    value: dailySelectionsStatus.Pending,
    labelKey: "dailySelections.dailySelectionStatus.Pending",
  },
  {
    value: dailySelectionsStatus.Initialized,
    labelKey: "dailySelections.dailySelectionStatus.Initialized",
  },
  {
    value: dailySelectionsStatus.Confirmed,
    labelKey: "dailySelections.dailySelectionStatus.Confirmed",
  },
  {
    value: dailySelectionsStatus.Preparing,
    labelKey: "dailySelections.dailySelectionStatus.Preparing",
  },
  {
    value: dailySelectionsStatus.OutForDelivery,
    labelKey: "dailySelections.dailySelectionStatus.OutForDelivery",
  },
  {
    value: dailySelectionsStatus.Delivered,
    labelKey: "dailySelections.dailySelectionStatus.Delivered",
  },
  {
    value: dailySelectionsStatus.Missed,
    labelKey: "dailySelections.dailySelectionStatus.Missed",
  },
  {
    value: dailySelectionsStatus.Paused,
    labelKey: "dailySelections.dailySelectionStatus.Paused",
  },
  {
    value: dailySelectionsStatus.Cancelled,
    labelKey: "dailySelections.dailySelectionStatus.Cancelled",
  },
] as const;

export type KitchenOrderedMealExportPeriod =
  | typeof ALL_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type KitchenOrderedMealAppliedFilters = {
  date: string;
};

export type KitchenOrderedMealExportFilters = {
  period: KitchenOrderedMealExportPeriod;
  fromDate: string;
  toDate: string;
  status: string;
};

export const createDefaultKitchenOrderedMealFilters = (
  defaultDate: string
): KitchenOrderedMealAppliedFilters => ({
  date: defaultDate,
});

export const createDefaultKitchenOrderedMealExportFilters =
  (): KitchenOrderedMealExportFilters => ({
    period: ALL_EXPORT_PERIODS,
    fromDate: "",
    toDate: "",
    status: ALL_DELIVERY_STATUS,
  });

export const buildKitchenOrderedMealFilterQueryParams = (
  filters: KitchenOrderedMealAppliedFilters,
  fallbackDate: string,
  clientId?: string | null
) => ({
  date: filters.date || fallbackDate,
  clientId: clientId ?? null,
});

export const buildKitchenOrderedMealExportParams = (
  filters: KitchenOrderedMealExportFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

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
  if (filters.status !== ALL_DELIVERY_STATUS) {
    params.status = filters.status;
  }

  return params;
};

/** @format */

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

export type KitchenMealCountExportPeriod =
  | typeof ALL_EXPORT_PERIODS
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "custom";

export type KitchenMealCountAppliedFilters = {
  date: string;
};

export type KitchenMealCountExportFilters = {
  period: KitchenMealCountExportPeriod;
  fromDate: string;
  toDate: string;
};

export const createDefaultKitchenMealCountFilters = (
  defaultDate: string
): KitchenMealCountAppliedFilters => ({
  date: defaultDate,
});

export const createDefaultKitchenMealCountExportFilters =
  (): KitchenMealCountExportFilters => ({
    period: ALL_EXPORT_PERIODS,
    fromDate: "",
    toDate: "",
  });

export const buildKitchenMealCountFilterQueryParams = (
  filters: KitchenMealCountAppliedFilters,
  fallbackDate: string
) => ({
  date: filters.date || fallbackDate,
});

export const buildKitchenMealCountExportParams = (
  filters: KitchenMealCountExportFilters
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

  return params;
};

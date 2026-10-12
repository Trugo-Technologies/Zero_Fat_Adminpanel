/** @format */

import { PromoDuration } from "src/types/modules/clientsManagement/discounts/promoCodes";

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
  { value: PromoDuration.Once, labelKey: "promoCodes.duration.Once" },
  { value: PromoDuration.Repeating, labelKey: "promoCodes.duration.Repeating" },
  { value: PromoDuration.Forever, labelKey: "promoCodes.duration.Forever" },
] as const;

export type PromoCodeAppliedFilters = {
  startDateFrom: string;
  startDateTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
  duration: string;
  status: string;
};

export const createDefaultPromoCodeFilters = (): PromoCodeAppliedFilters => ({
  startDateFrom: "",
  startDateTo: "",
  expirationDateFrom: "",
  expirationDateTo: "",
  duration: ALL_DURATIONS,
  status: ALL_STATUS,
});

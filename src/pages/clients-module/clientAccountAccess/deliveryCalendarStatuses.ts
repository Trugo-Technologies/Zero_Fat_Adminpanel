/** @format */

import { DeliveryStatus } from "./types";

/** Legacy numeric status codes (older API responses). */
export const DELIVERY_CALENDAR_STATUS = {
  Pending: 0,
  Delivered: 1,
  Skipped: 2,
  Moved: 3,
  Unavailable: 4,
  Cancelled: 5,
} as const;

export type DeliveryCalendarStatusFilter =
  | "All Status"
  | "Pending"
  | "Delivered"
  | "Skipped"
  | "Moved"
  | "Unavailable"
  | "Cancelled";

export const DELIVERY_CALENDAR_STATUS_FILTERS: DeliveryCalendarStatusFilter[] = [
  "All Status",
  "Pending",
  "Delivered",
  "Skipped",
  "Moved",
  "Unavailable",
  "Cancelled",
];

const UI_STATUSES: DeliveryStatus[] = [
  "Pending",
  "Delivered",
  "Skipped",
  "Moved",
  "Unavailable",
  "Cancelled",
];

const STRING_STATUS_ALIASES: Record<string, DeliveryStatus> = {
  scheduled: "Pending",
  canceled: "Cancelled",
  paused: "Pending",
};

export const deliveryCalendarStatusFilterToApi = (
  filter: DeliveryCalendarStatusFilter
): string | undefined => {
  if (filter === "All Status") return undefined;

  return filter;
};

export const mapApiDeliveryStatusToUi = (status: number | string): DeliveryStatus => {
  if (typeof status === "string") {
    const normalized = status.trim();
    const directMatch = UI_STATUSES.find(
      (value) => value.toLowerCase() === normalized.toLowerCase()
    );
    if (directMatch) return directMatch;

    const alias = STRING_STATUS_ALIASES[normalized.toLowerCase()];
    if (alias) return alias;

    return "Pending";
  }

  switch (status) {
    case DELIVERY_CALENDAR_STATUS.Delivered:
      return "Delivered";
    case DELIVERY_CALENDAR_STATUS.Skipped:
      return "Skipped";
    case DELIVERY_CALENDAR_STATUS.Moved:
      return "Moved";
    case DELIVERY_CALENDAR_STATUS.Unavailable:
      return "Unavailable";
    case DELIVERY_CALENDAR_STATUS.Cancelled:
      return "Cancelled";
    case DELIVERY_CALENDAR_STATUS.Pending:
    default:
      return "Pending";
  }
};

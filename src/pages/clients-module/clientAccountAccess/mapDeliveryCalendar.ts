/** @format */

import {
  IDeliveryCalendarDay,
  IDeliveryCalendarSummary,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { mapApiDeliveryStatusToUi } from "./deliveryCalendarStatuses";
import { DeliveryDay } from "./types";

export const mapDeliveryCalendarDayToDeliveryDay = (
  day: IDeliveryCalendarDay
): DeliveryDay => ({
  date: day.date,
  status: mapApiDeliveryStatusToUi(day.status),
  scheduleLabel: day.scheduleLabel ?? null,
  mealCount: day.mealCount,
  dailySelectionId: day.dailySelectionId,
});

export const mapDeliveryCalendarDays = (
  days: IDeliveryCalendarDay[] = []
): DeliveryDay[] => days.map(mapDeliveryCalendarDayToDeliveryDay);

export const mapDeliveryCalendarSummaryToStats = (
  summary?: IDeliveryCalendarSummary
) => ({
  Delivered: summary?.delivered ?? 0,
  Pending: summary?.pending ?? 0,
  Skipped: summary?.skipped ?? 0,
  Moved: summary?.moved ?? 0,
  Cancelled: summary?.cancelled ?? 0,
});

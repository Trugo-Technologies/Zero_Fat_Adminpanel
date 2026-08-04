/** @format */

import dayjs, { Dayjs } from "dayjs";
import { IClientPortalSettings } from "src/types/modules/clientsManagement/clientPortalSettings";

export const DURATION_OPTIONS = [
  { label: "1 Week", subscriptionType: "OneWeek", days: 5 },
  { label: "1 Month", subscriptionType: "OneMonth", days: 22 },
  { label: "3 Months", subscriptionType: "ThreeMonths", days: 66 },
  { label: "Custom", subscriptionType: "Custom", days: 0 },
] as const;

export type DurationLabel = (typeof DURATION_OPTIONS)[number]["label"];

export type WizardCalendarDayStatus =
  | "Selected"
  | "Available"
  | "ActiveSubs"
  | "UpcomingSubs"
  | "Unavailable";

export const WEEKDAY_OPTIONS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
] as const;

export const DISABLED_WEEKDAYS = [6] as const;
export const MIN_WEEKDAY_SELECTION = 4;
export const MAX_WEEKDAY_SELECTION = 6;
export const MIN_DELIVERY_DATES_PER_WEEK = 4;
export const MIN_DELIVERY_DATES_PER_MONTH = 16;
export const DEFAULT_SELECTED_WEEKDAYS = [1, 2, 3, 4, 5];

const DURATION_LABEL_TO_TYPE = Object.fromEntries(
  DURATION_OPTIONS.map((option) => [option.label, option.subscriptionType])
) as Record<DurationLabel, string>;

const SUBSCRIPTION_TYPE_TO_LABEL = Object.fromEntries(
  DURATION_OPTIONS.map((option) => [option.subscriptionType, option.label])
) as Record<string, DurationLabel>;

export const isCustomDuration = (duration: string) => duration === "Custom";

export const isWeekdayDisabled = (weekday: number) =>
  DISABLED_WEEKDAYS.includes(weekday as (typeof DISABLED_WEEKDAYS)[number]);

export const mapDurationToSubscriptionType = (duration: string) =>
  DURATION_LABEL_TO_TYPE[duration as DurationLabel] ?? "OneMonth";

export const mapSubscriptionTypeToDuration = (subscriptionType: string | null) => {
  if (subscriptionType === "ThreeMonths") return "3 Months";
  if (subscriptionType === "Custom") return "Custom";

  return (
    (subscriptionType && SUBSCRIPTION_TYPE_TO_LABEL[subscriptionType]) || "1 Month"
  );
};

export const getDurationWeeks = (duration: string) => {
  if (duration === "1 Week") return 1;
  if (duration === "1 Month") return 4;
  if (duration === "3 Months") return 12;
  return 0;
};

export const getDaysFromDuration = (duration: string) => {
  const option = DURATION_OPTIONS.find((item) => item.label === duration);
  return option?.days ?? 0;
};

export const getDurationPackageDiscount = (
  duration: string,
  settings?: IClientPortalSettings | null
): number | null => {
  if (!settings) return null;

  const subscriptionType = mapDurationToSubscriptionType(duration);

  if (subscriptionType === "OneMonth") {
    return settings.monthlyPackageSubsciptionDiscount;
  }

  if (subscriptionType === "ThreeMonths") {
    return settings.threeMonthlyPackageSubsciptionDiscount;
  }

  return null;
};

export const inferWeekdaysFromDates = (dates: string[]): number[] => {
  const weekdays = new Set<number>();
  dates.forEach((date) => {
    const weekday = dayjs(date).day();
    if (!isWeekdayDisabled(weekday)) {
      weekdays.add(weekday);
    }
  });
  return Array.from(weekdays).sort((a, b) => a - b);
};

export const toggleSelectedWeekday = (
  weekdays: number[],
  weekday: number,
  options?: { enforceLimits?: boolean }
): number[] => {
  const enforceLimits = options?.enforceLimits ?? true;

  if (isWeekdayDisabled(weekday)) return weekdays;

  const exists = weekdays.includes(weekday);
  if (exists) {
    if (enforceLimits && weekdays.length <= MIN_WEEKDAY_SELECTION) return weekdays;
    return weekdays.filter((item) => item !== weekday).sort((a, b) => a - b);
  }

  if (enforceLimits && weekdays.length >= MAX_WEEKDAY_SELECTION) return weekdays;
  return [...weekdays, weekday].sort((a, b) => a - b);
};

/** Max delivery dates for fixed packages: 6 per week of the package (toast when exceeded). */
export const getMaxDeliveryDatesForDuration = (duration: string): number => {
  if (isCustomDuration(duration)) {
    return Number.POSITIVE_INFINITY;
  }

  const weeks = getDurationWeeks(duration);
  if (weeks <= 0) {
    return 0;
  }

  return MAX_WEEKDAY_SELECTION * weeks;
};

/** Min delivery dates for fixed packages. Custom has no minimum. */
export const getMinDeliveryDatesForDuration = (duration: string): number => {
  if (isCustomDuration(duration)) {
    return 0;
  }

  if (duration === "1 Week") {
    return MIN_DELIVERY_DATES_PER_WEEK;
  }

  if (duration === "1 Month") {
    return MIN_DELIVERY_DATES_PER_MONTH;
  }

  if (duration === "3 Months") {
    return MIN_DELIVERY_DATES_PER_MONTH * 3;
  }

  return 0;
};

export const getDeliveryDateCountRangeForDuration = (duration: string) => ({
  min: getMinDeliveryDatesForDuration(duration),
  max: getMaxDeliveryDatesForDuration(duration),
});

/** Builds delivery dates from weekday pattern across the package window. */
export const getDeliveryDatesFromWeekdays = (
  startDate: Dayjs | null,
  duration: string,
  selectedWeekdays: number[],
  activeSubDates: string[] = []
): string[] => {
  if (!startDate || isCustomDuration(duration) || selectedWeekdays.length === 0) {
    return [];
  }

  const weeks = getDurationWeeks(duration);
  if (weeks <= 0) return [];

  const periodStart = startDate.startOf("day");
  const periodEnd = periodStart.add(weeks, "week").subtract(1, "day");
  const dates: string[] = [];
  let current = periodStart;

  while (current.isBefore(periodEnd, "day") || current.isSame(periodEnd, "day")) {
    const dateStr = current.format("YYYY-MM-DD");
    const weekday = current.day();

    if (
      selectedWeekdays.includes(weekday) &&
      !current.isBefore(dayjs(), "day") &&
      !activeSubDates.includes(dateStr)
    ) {
      dates.push(dateStr);
    }

    current = current.add(1, "day");
  }

  return dates;
};

/** @deprecated Use getDeliveryDatesFromWeekdays — kept for any legacy callers. */
export const getSelectedDeliveryDates = (
  startDate: Dayjs | null,
  duration: string,
  _skipSaturdays: boolean,
  _skipSundays: boolean,
  selectedWeekdays: number[] = DEFAULT_SELECTED_WEEKDAYS,
  activeSubDates: string[] = []
): string[] =>
  getDeliveryDatesFromWeekdays(
    startDate,
    duration,
    selectedWeekdays,
    activeSubDates
  );

export const toggleSelectedDeliveryDate = (
  dates: string[],
  date: string
): string[] => {
  const exists = dates.includes(date);
  const next = exists ? dates.filter((item) => item !== date) : [...dates, date];
  return next.sort();
};

export const getWizardCalendarDayStatus = ({
  day,
  selectedDates,
  activeSubDates,
  upcomingSubDates = [],
}: {
  day: Dayjs;
  selectedDates: string[];
  activeSubDates: string[];
  upcomingSubDates?: string[];
}): WizardCalendarDayStatus => {
  const dateStr = day.format("YYYY-MM-DD");

  if (day.isBefore(dayjs(), "day") || isWeekdayDisabled(day.day())) {
    return "Unavailable";
  }

  if (activeSubDates.includes(dateStr)) {
    return "ActiveSubs";
  }

  if (upcomingSubDates.includes(dateStr)) {
    return "UpcomingSubs";
  }

  if (selectedDates.includes(dateStr)) {
    return "Selected";
  }

  return "Available";
};

type FirstAvailableDateParams = {
  selectedWeekdays?: number[];
  activeSubscriptionEndDate?: string | null;
  hasActiveSubscription?: boolean;
  upcomingSubscriptionEndDate?: string | null;
  hasUpcomingSubscription?: boolean;
  upcomingSelectedDeliveryDates?: string[];
  blockedDates?: string[];
};

export const getWeekdayLabel = (weekday: number) =>
  WEEKDAY_OPTIONS.find((option) => option.value === weekday)?.label ?? "This day";

export const resolveBlockedSubscriptionEndDate = ({
  activeSubscriptionEndDate,
  hasActiveSubscription,
  upcomingSubscriptionEndDate,
  hasUpcomingSubscription,
  upcomingSelectedDeliveryDates = [],
}: {
  activeSubscriptionEndDate?: string | null;
  hasActiveSubscription?: boolean;
  upcomingSubscriptionEndDate?: string | null;
  hasUpcomingSubscription?: boolean;
  upcomingSelectedDeliveryDates?: string[];
}): Dayjs | null => {
  const endDates: Dayjs[] = [];

  if (Boolean(hasActiveSubscription) && activeSubscriptionEndDate) {
    endDates.push(dayjs(activeSubscriptionEndDate));
  }

  if (Boolean(hasUpcomingSubscription)) {
    if (upcomingSubscriptionEndDate) {
      endDates.push(dayjs(upcomingSubscriptionEndDate));
    } else if (upcomingSelectedDeliveryDates.length > 0) {
      const lastUpcoming = [...upcomingSelectedDeliveryDates].sort().at(-1);
      if (lastUpcoming) {
        endDates.push(dayjs(lastUpcoming));
      }
    }
  }

  if (endDates.length === 0) return null;

  return endDates.reduce((latest, current) =>
    current.isAfter(latest, "day") ? current : latest
  );
};

export const getFirstAvailableDeliveryDate = ({
  selectedWeekdays = DEFAULT_SELECTED_WEEKDAYS,
  activeSubscriptionEndDate,
  hasActiveSubscription,
  upcomingSubscriptionEndDate,
  hasUpcomingSubscription,
  upcomingSelectedDeliveryDates = [],
  blockedDates = [],
}: FirstAvailableDateParams): Dayjs => {
  const blockedEndDate = resolveBlockedSubscriptionEndDate({
    activeSubscriptionEndDate,
    hasActiveSubscription,
    upcomingSubscriptionEndDate,
    hasUpcomingSubscription,
    upcomingSelectedDeliveryDates,
  });

  let current = blockedEndDate
    ? blockedEndDate.add(1, "day").startOf("day")
    : dayjs().startOf("day");

  const earliestDate = current;
  const blockedSet = new Set(blockedDates);

  const matchesWeekday = (date: Dayjs) => {
    if (isWeekdayDisabled(date.day())) return false;
    if (!selectedWeekdays.length) return true;
    return selectedWeekdays.includes(date.day());
  };

  for (let index = 0; index < 366; index += 1) {
    const dateStr = current.format("YYYY-MM-DD");
    if (
      matchesWeekday(current) &&
      !current.isBefore(dayjs(), "day") &&
      !blockedSet.has(dateStr)
    ) {
      return current;
    }

    current = current.add(1, "day");
  }

  return earliestDate;
};

export const deriveSkipFlagsFromWeekdays = (selectedWeekdays: number[]) => ({
  skipSaturdays: true,
  skipSundays: !selectedWeekdays.includes(0),
});

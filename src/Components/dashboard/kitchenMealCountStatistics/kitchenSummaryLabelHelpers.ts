/** @format */

import { MessageFormatElement } from "react-intl";

const KITCHEN_SUMMARY_LABEL_KEYS: Record<string, string> = {
  totalMeals: "dashboard.kitchen.totalMeals",
  totalRequestCount: "dashboard.kitchen.totalRequestCount",
  totalRequests: "dashboard.kitchen.totalRequests",
  requestCount: "kitchen.requestCount",
  uniqueMeals: "dashboard.kitchen.uniqueMeals",
};

const formatFieldLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

export const getKitchenSummaryLabel = (
  key: string,
  messages: Record<string, MessageFormatElement[]> | Record<string, string>
) => {
  const messageId = KITCHEN_SUMMARY_LABEL_KEYS[key] ?? `dashboard.kitchen.${key}`;
  const translated = messages[messageId] as string;

  if (translated && translated !== messageId) {
    return translated;
  }

  return formatFieldLabel(key);
};

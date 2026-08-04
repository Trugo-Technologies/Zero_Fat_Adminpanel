/** @format */

export type DeliveryCancelScopeOption =
  | "thisDay"
  | "upcoming"
  | "entireOrder"
  | "mealPlanOnly";

export type DeliveryActionScopeOption = DeliveryCancelScopeOption;

export const DELIVERY_CANCEL_SCOPE = {
  thisDay: 0,
  upcoming: 1,
  entireOrder: 2,
  mealPlanOnly: 3,
} as const;

export const deliveryCancelScopeToApi = (scope: DeliveryCancelScopeOption) =>
  DELIVERY_CANCEL_SCOPE[scope];

export const deliveryActionScopeToApi = deliveryCancelScopeToApi;

export const PAYMENT_METHOD_OPTIONS = [
  { value: "card", label: "Card" },
  { value: "online", label: "Online" },
  { value: "cash", label: "Cash" },
] as const;

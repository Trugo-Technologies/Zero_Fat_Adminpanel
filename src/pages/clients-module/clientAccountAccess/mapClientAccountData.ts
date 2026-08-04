/** @format */

import dayjs, { Dayjs } from "dayjs";
import {
  IBlockClientAccountAccessPayload,
  IClientAccountAccessData,
  IClientAccountAccessDeliveryAddress,
  IClientAccountAccessSubscription,
  IClientAccountActivityLog,
  IClientAccountSubscriptionSummary,
  SubscriptionWizardMode,
  IUpdateClientAccountAccessPayload,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { AccessStatus, ActivityLogRow, ClientAccountData } from "./types";

export const isValidSubscriptionDate = (value?: string | null): boolean => {
  if (!value?.trim()) return false;
  const date = dayjs(value);
  // Ignore empty/sentinel dates from APIs for never-subscribed clients
  return date.isValid() && date.year() >= 2000;
};

/** True when the API identifies the current subscription as renewable. */
export const canRenewSubscription = (client: ClientAccountData): boolean => {
  if (client.isRenewalSubscription) return true;

  const orderType = (client.subscriptionOrderType || "").trim().toLowerCase();
  if (orderType === "renewal" || orderType === "existinguser") return true;
  if (orderType === "new") return false;

  const status = (client.subscriptionStatus || "").trim().toLowerCase();
  if (
    status === "active" ||
    status === "pending" ||
    status === "expired" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "paused" ||
    status === "suspended" ||
    status === "pastdue"
  ) {
    return true;
  }

  return (
    isValidSubscriptionDate(client.subscriptionStartDate) ||
    isValidSubscriptionDate(client.subscriptionEndDate)
  );
};

/** @deprecated Use canRenewSubscription */
export const isExistingSubscriptionUser = canRenewSubscription;

/** @deprecated Prefer canRenewSubscription — kept for callers that still infer from dates/status. */
export const hasEverSubscribed = (client: ClientAccountData): boolean => {
  if (canRenewSubscription(client)) return true;

  const status = (client.subscriptionStatus || "").trim().toLowerCase();

  if (
    status === "active" ||
    status === "pending" ||
    status === "expired" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "paused" ||
    status === "suspended"
  ) {
    return true;
  }

  return (
    isValidSubscriptionDate(client.subscriptionStartDate) ||
    isValidSubscriptionDate(client.subscriptionEndDate)
  );
};

export const getSubscriptionWizardMode = (
  client: ClientAccountData
): SubscriptionWizardMode => {
  return canRenewSubscription(client) ? "Renew" : "New";
};

const normalizeSubscriptionSource = (
  subscription:
    | IClientAccountAccessSubscription
    | IClientAccountSubscriptionSummary
    | null
    | undefined
) => {
  if (!subscription) return null;

  return {
    subscriptionStatus:
      subscription.subscriptionStatus ?? subscription.status ?? "",
    startDate:
      subscription.startDate ??
      ("subscriptionStartDate" in subscription
        ? subscription.subscriptionStartDate
        : undefined) ??
      "",
    endDate:
      subscription.endDate ??
      ("subscriptionEndDate" in subscription
        ? subscription.subscriptionEndDate
        : undefined) ??
      "",
    activeMealPlan:
      subscription.activeMealPlanName ??
      subscription.activeMealPlan ??
      ("mealPlanName" in subscription ? subscription.mealPlanName : undefined) ??
      "",
    calories:
      subscription.averageCalories ?? subscription.calories ?? 0,
    mealsPerDay: subscription.mealsPerDay ?? 0,
    remainingDays: subscription.remainingDays ?? 0,
    totalDeliveredMeals: subscription.totalDeliveredMeals ?? 0,
    upcomingDeliveries: subscription.upcomingDeliveries ?? 0,
  };
};

const hasSubscriptionData = (
  subscription:
    | IClientAccountAccessSubscription
    | IClientAccountSubscriptionSummary
    | null
    | undefined
) => {
  const normalized = normalizeSubscriptionSource(subscription);
  if (!normalized) return false;

  return Boolean(
    normalized.subscriptionStatus ||
      normalized.startDate ||
      normalized.endDate ||
      normalized.activeMealPlan
  );
};

const mapAccessStatus = (
  accessStatus: string,
  blockOption: number,
  blockedUntil: string | null
): AccessStatus => {
  if (accessStatus === "Active" || blockOption === 0) {
    return "Active";
  }
  if (blockOption === 3) {
    return "Blocked";
  }
  if (blockedUntil || blockOption === 1 || blockOption === 2) {
    return "TemporaryBlock";
  }
  if (accessStatus === "TemporaryBlock") {
    return "TemporaryBlock";
  }
  return "Blocked";
};

export const blockOptionToUiType = (
  blockOption: number
): "oneDay" | "custom" | "permanent" => {
  if (blockOption === 2) return "custom";
  if (blockOption === 3) return "permanent";
  return "oneDay";
};

const formatSingleDeliveryAddress = (
  address: Record<string, unknown>
): string => {
  const fullAddress =
    address.fullAddress ||
    address.fullAddressEn ||
    address.fullAddressAr ||
    address.address;

  if (typeof fullAddress === "string" && fullAddress.trim()) {
    return fullAddress.trim();
  }

  const parts = [
    address.flat && `Flat ${address.flat}`,
    address.building && `Building ${address.building}`,
    address.street,
    address.area,
    address.block && `Block ${address.block}`,
    address.office && `Office ${address.office}`,
    address.postalCode,
  ].filter((part): part is string => Boolean(part && String(part).trim()));

  const formatted = parts.map(String).join(", ");
  const type = address.type ? String(address.type) : "";

  if (type && formatted) {
    return `${type} — ${formatted}`;
  }

  return type || formatted;
};

const formatDeliveryAddress = (addresses: unknown[]): string => {
  if (!addresses?.length) {
    return "—";
  }

  return addresses
    .map((address) => {
      if (typeof address === "string") {
        return address.trim();
      }
      if (address && typeof address === "object") {
        return formatSingleDeliveryAddress(address as Record<string, unknown>);
      }
      return "";
    })
    .filter(Boolean)
    .join(" | ");
};

const mapSubscriptionFields = (
  subscription: IClientAccountAccessSubscription | null
) => {
  if (!hasSubscriptionData(subscription)) {
    return {
      subscriptionStatus: "Inactive",
      subscriptionOrderType: subscription?.subscriptionOrderType ?? "",
      isRenewalSubscription:
        subscription?.isRenewalSubscription ?? false,
      subscriptionStartDate: "",
      subscriptionEndDate: "",
      activeMealPlan: "—",
      calories: 0,
      mealsPerDay: 0,
      remainingDays: 0,
      totalDeliveredMeals: 0,
      upcomingDeliveries: 0,
    };
  }

  const normalized = normalizeSubscriptionSource(subscription)!;

  return {
    subscriptionStatus: normalized.subscriptionStatus || "Inactive",
    subscriptionOrderType: subscription?.subscriptionOrderType ?? "",
    isRenewalSubscription:
      subscription?.isRenewalSubscription ?? false,
    subscriptionStartDate: normalized.startDate,
    subscriptionEndDate: normalized.endDate,
    activeMealPlan: normalized.activeMealPlan || "—",
    calories: normalized.calories,
    mealsPerDay: normalized.mealsPerDay,
    remainingDays: normalized.remainingDays,
    totalDeliveredMeals: normalized.totalDeliveredMeals,
    upcomingDeliveries: normalized.upcomingDeliveries,
  };
};

export const mapSubscriptionSummaryToClientFields = (
  summary: IClientAccountSubscriptionSummary | null | undefined
) => {
  if (!hasSubscriptionData(summary)) {
    return {};
  }

  const normalized = normalizeSubscriptionSource(summary)!;

  return {
    subscriptionStatus: normalized.subscriptionStatus || "Inactive",
    subscriptionStartDate: normalized.startDate,
    subscriptionEndDate: normalized.endDate,
    activeMealPlan: normalized.activeMealPlan || "—",
    calories: normalized.calories,
    mealsPerDay: normalized.mealsPerDay,
    remainingDays: normalized.remainingDays,
    totalDeliveredMeals: normalized.totalDeliveredMeals,
    upcomingDeliveries: normalized.upcomingDeliveries,
  };
};

export const mapClientAccountAccessToClientData = (
  data: IClientAccountAccessData
): ClientAccountData => {
  const subscriptionFields = mapSubscriptionFields(data.subscription);

  return {
    id: data.clientId,
    customerId: data.clientId,
    fullName: data.fullName,
    email: data.email,
    phone: data.mobile,
    birthDate: data.birthDate,
    gender: data.gender,
    deliveryAddress: formatDeliveryAddress(data.deliveryAddresses),
    deliveryAddresses: data.deliveryAddresses,
    isActive: data.isActive,
    heightInCM: data.heightInCM,
    weightInKG: data.weightInKG,
    targetWeightInKG: data.targetWeightInKG,
    bodyFat: data.bodyFat,
    bmi: data.bmi,
    bmr: data.bmr,
    tdee: data.tdee,
    activityValue: 0,
    dietitianGoal: data.dietitianGoal,
    neededCaloriesToReachGoal: data.neededCaloriesToReachGoal,
    timeToReachGoalInDays: data.timeToReachGoalInDays,
    clientAllergics: data.allergens ?? [],
    accessStatus: mapAccessStatus(
      data.accessControl.accessStatus,
      data.accessControl.blockOption,
      data.accessControl.blockedUntil
    ),
    rawAccessStatus: data.accessControl.accessStatus,
    blockOption: data.accessControl.blockOption,
    blockedOn: data.accessControl.blockedOn ?? undefined,
    blockExpiryDate: data.accessControl.blockedUntil ?? undefined,
    lastLoginDate: data.accessControl.lastLogin ?? undefined,
    ...subscriptionFields,
  };
};

export const buildUpdateClientAccountAccessPayload = (
  form: ClientAccountData,
  addresses: Array<Partial<IClientAccountAccessDeliveryAddress> & Record<string, unknown>>
): IUpdateClientAccountAccessPayload => ({
  clientId: form.id,
  fullName: form.fullName,
  email: form.email,
  mobile: form.phone,
  gender: form.gender,
  birthDate: dayjs(form.birthDate).toISOString(),
  deliveryAddresses: addresses.map((address) => ({
    ...(address.id ? { id: address.id } : {}),
    type: address.type || "Home",
    area: address.area || "",
    building: address.building || "",
    flat: address.flat || "",
    street: address.street || "",
  })),
});

export const mapActivityLogToRow = (
  log: IClientAccountActivityLog
): ActivityLogRow => ({
  id: log.id,
  action: log.action,
  actionType: log.actionType,
  performedBy: log.performedBy,
  previousValue: log.previousValue,
  newValue: log.newValue,
  date: log.date,
  time: log.time?.split(".")[0] ?? log.time,
});

export const getSubscriptionStatusChipColor = (
  status: string
): "success" | "warning" | "error" | "default" => {
  if (status === "Active") return "success";
  if (status === "Pending") return "warning";
  if (status === "Inactive") return "default";
  return "error";
};

export const buildBlockClientAccountAccessPayload = (
  clientId: string,
  type: "oneDay" | "custom" | "permanent",
  expiry?: Dayjs
): IBlockClientAccountAccessPayload => {
  if (type === "oneDay") {
    return {
      clientId,
      blockOption: 1,
      blockedUntil: dayjs().add(1, "day").toISOString(),
    };
  }

  if (type === "custom") {
    return {
      clientId,
      blockOption: 2,
      blockedUntil: (expiry ?? dayjs().add(1, "day")).toISOString(),
    };
  }

  return {
    clientId,
    blockOption: 3,
    blockedUntil: null,
  };
};
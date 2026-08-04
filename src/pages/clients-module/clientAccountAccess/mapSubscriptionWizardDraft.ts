/** @format */

import dayjs, { Dayjs } from "dayjs";
import {
  ISubscriptionWizardDraft,
  ISubscriptionWizardMealTypeSelection,
  IUpdateSubscriptionWizardConfigurationPayload,
  IUpdateSubscriptionWizardRenewalOptionsPayload,
  IUpdateSubscriptionWizardSchedulePayload,
  IUpdateSubscriptionWizardBillingPayload,
  IFinalizeSubscriptionWizardPayload,
  SubscriptionWizardPaymentProvider,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { CartItem } from "./components/createSubscription/Step1Configuration";
import {
  DEFAULT_SELECTED_WEEKDAYS,
  deriveSkipFlagsFromWeekdays,
  getFirstAvailableDeliveryDate,
  inferWeekdaysFromDates,
  mapDurationToSubscriptionType,
  mapSubscriptionTypeToDuration,
} from "./subscriptionWizardSchedule";
import { getMealTypeSelectionsTotalQuantity } from "./mealPlanHelpers";

export type RenewalStrategyUi = "extend" | "future";

export const mapApiRenewalStrategyToUi = (
  draft: ISubscriptionWizardDraft
): RenewalStrategyUi => {
  if (draft.scheduledStartDate) {
    return "future";
  }

  if (draft.renewalStrategy === "ExtendAfterExpiry") {
    return "extend";
  }

  return "extend";
};

export const buildRenewalOptionsPayload = (
  draftId: string,
  renewalStrategy: RenewalStrategyUi,
  scheduledStartDate: Dayjs | null
): IUpdateSubscriptionWizardRenewalOptionsPayload => {
  if (renewalStrategy === "extend") {
    return {
      draftId,
      renewalStrategy: "ExtendAfterExpiry",
    };
  }

  if (!scheduledStartDate) {
    return { draftId };
  }

  return {
    draftId,
    scheduledStartDate: scheduledStartDate.format("YYYY-MM-DD"),
  };
};

const parseMealTypeSelectionObjects = (
  mealTypeSelections: ISubscriptionWizardDraft["mealTypeSelections"] = []
): ISubscriptionWizardMealTypeSelection[] => {
  return (mealTypeSelections ?? [])
    .map((meal) =>
      typeof meal === "string"
        ? { mealTypeId: "", name: meal, quantityPerDay: 1 }
        : meal
    )
    .filter((meal) => meal.name);
};

const parseAddOnCart = (
  addOnItems: ISubscriptionWizardDraft["addOnItems"]
): CartItem[] =>
  addOnItems.map((item) => ({
    id: item.itemId,
    name: item.nameEn,
    nameAr: item.nameAr,
    category: item.category,
    price: item.unitPrice,
    quantity: item.quantity,
  }));

export type ConfigurationFormState = {
  selectedPlan: string;
  calorieTarget: number;
  mealTypeSelections: ISubscriptionWizardMealTypeSelection[];
  cart: CartItem[];
};

export const buildConfigurationPayload = (
  draftId: string,
  form: ConfigurationFormState
): IUpdateSubscriptionWizardConfigurationPayload => {
  const totalMeals = getMealTypeSelectionsTotalQuantity(form.mealTypeSelections);

  return {
    draftId,
    mealPlanId: form.selectedPlan,
    planVariant: String(totalMeals),
    calorieTarget: form.calorieTarget,
    proteinTargetG: 0,
    mealTypeSelections: form.mealTypeSelections,
    addOnItems: form.cart.map((item) => ({
      itemId: item.id,
      nameEn: item.name,
      nameAr: item.nameAr ?? item.name,
      category: item.category ?? "Meals",
      quantity: item.quantity,
      unitPrice: item.price,
    })),
  };
};

export type ScheduleFormState = {
  duration: string;
  selectedWeekdays: number[];
  selectedDate: Dayjs | null;
  selectedDeliveryDates: string[];
  preferredDeliveryTime: string;
  clientLocationId: string;
  promoCode: string;
  manualDiscount: string;
};

export const buildSchedulePayload = (
  draftId: string,
  form: ScheduleFormState
): IUpdateSubscriptionWizardSchedulePayload => {
  const subscriptionType = mapDurationToSubscriptionType(form.duration);
  const selectedDeliveryDates = [...form.selectedDeliveryDates].sort();
  const scheduledStartDate =
    selectedDeliveryDates[0] ??
    form.selectedDate?.format("YYYY-MM-DD") ??
    "";
  const skipFlags = deriveSkipFlagsFromWeekdays(form.selectedWeekdays);

  return {
    draftId,
    subscriptionType,
    skipSaturdays: skipFlags.skipSaturdays,
    skipSundays: skipFlags.skipSundays,
    selectedDeliveryDates,
    preferredDeliveryTime: form.preferredDeliveryTime,
    clientLocationId: form.clientLocationId,
    promoCode: form.promoCode,
    manualDiscountAed: parseFloat(form.manualDiscount) || 0,
    scheduledStartDate,
  };
};

export const buildBillingPayload = (
  draftId: string,
  customerEmail: string,
  optionalMessage: string
): IUpdateSubscriptionWizardBillingPayload => ({
  draftId,
  customerEmail,
  optionalMessage: optionalMessage || undefined,
});

export const buildFinalizePayload = (
  draftId: string,
  paymentProvider: SubscriptionWizardPaymentProvider
): IFinalizeSubscriptionWizardPayload => ({
  draftId,
  paymentProvider,
});

const WIZARD_STEP_LABELS = {
  renew: [
    "Renewal Options",
    "Configuration",
    "Schedule",
    "Billing & Review",
  ],
  new: ["Configuration", "Schedule", "Billing & Review"],
} as const;

export const getWizardStepIndex = (
  currentStep: string,
  wizardMode: "new" | "renew"
) => {
  const steps = WIZARD_STEP_LABELS[wizardMode];
  const index = steps.findIndex(
    (step) => step.toLowerCase() === currentStep.toLowerCase()
  );

  return index >= 0 ? index : 0;
};

export const mapSubscriptionWizardDraftToFormState = (
  draft: ISubscriptionWizardDraft
) => {
  const renewalStrategy = mapApiRenewalStrategyToUi(draft);
  const isRenew = draft.wizardMode === "Renew";

  const resolveSelectedDate = (): Dayjs | null => {
    if (draft.selectedDeliveryDates[0]) {
      return dayjs(draft.selectedDeliveryDates[0]);
    }

    if (isRenew && renewalStrategy === "future") {
      return draft.scheduledStartDate ? dayjs(draft.scheduledStartDate) : null;
    }

    if (isRenew && renewalStrategy === "extend") {
      return getFirstAvailableDeliveryDate({
        selectedWeekdays: DEFAULT_SELECTED_WEEKDAYS,
        activeSubscriptionEndDate: draft.activeSubscriptionEndDate,
        hasActiveSubscription: draft.hasActiveSubscription,
        upcomingSubscriptionEndDate: draft.upcomingSubscriptionEndDate,
        hasUpcomingSubscription: draft.hasUpcomingSubscription,
        upcomingSelectedDeliveryDates: draft.upcomingSelectedDeliveryDates,
      });
    }

    return getFirstAvailableDeliveryDate({
      selectedWeekdays: DEFAULT_SELECTED_WEEKDAYS,
    });
  };

  return {
  subscriptionMode: isRenew ? ("renew" as const) : ("new" as const),
  activeStep: getWizardStepIndex(
    draft.currentStep,
    draft.wizardMode === "Renew" ? "renew" : "new"
  ),
  renewalStrategy,
  scheduledStartDate: draft.scheduledStartDate
    ? dayjs(draft.scheduledStartDate)
    : null,
  selectedPlan: draft.mealPlanId ?? "",
  mealTypeSelections: parseMealTypeSelectionObjects(draft.mealTypeSelections),
  enableAddons: draft.addOnItems?.length > 0,
  cart: parseAddOnCart(draft.addOnItems ?? []),
  duration: mapSubscriptionTypeToDuration(draft.subscriptionType),
  selectedWeekdays:
    draft.selectedDeliveryDates?.length > 0
      ? inferWeekdaysFromDates(draft.selectedDeliveryDates)
      : DEFAULT_SELECTED_WEEKDAYS,
  selectedDate: resolveSelectedDate(),
  selectedDeliveryDates: [...(draft.selectedDeliveryDates ?? [])].sort(),
  preferredDeliveryTime: draft.preferredDeliveryTime ?? "EarlyMorning",
  clientLocationId: draft.clientLocationId ?? "",
  promoCode: draft.promoCode ?? "",
  manualDiscount:
    draft.manualDiscountAed > 0 ? String(draft.manualDiscountAed) : "",
  customerEmail: draft.customerEmail ?? "",
  paymentMessage: draft.optionalMessage ?? "",
};
};

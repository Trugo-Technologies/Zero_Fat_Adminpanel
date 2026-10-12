/** @format */

import { IBaseResponseDetailsDto } from "src/types/baseEntity";
import { IAllergens } from "../../nutriplan/allergens";

export interface IClientAccountAccessDeliveryAddress {
  id?: string;
  type: string;
  area: string;
  building: string;
  flat: string;
  street: string;
}

export interface IUpdateClientAccountAccessPayload {
  clientId: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  birthDate: string;
  deliveryAddresses: IClientAccountAccessDeliveryAddress[];
}

export interface IBlockClientAccountAccessPayload {
  clientId: string;
  blockOption: number;
  blockedUntil: string | null;
}

export interface IClientAccountAccessControl {
  accessStatus: string;
  blockOption: number;
  blockedOn: string | null;
  blockedUntil: string | null;
  lastLogin: string | null;
}

export interface IClientAccountAccessSubscription {
  subscriptionId?: string;
  subscriptionStatus?: string;
  status?: string;
  /** e.g. "ExistingUser" — drives Renew vs Create UI */
  subscriptionOrderType?: string;
  isRenewalSubscription?: boolean;
  renewalCount?: number;
  startDate?: string;
  endDate?: string;
  activeMealPlanName?: string;
  activeMealPlan?: string;
  averageCalories?: number;
  calories?: number;
  mealsPerDay?: number;
  remainingDays?: number;
  totalDeliveredMeals?: number;
  upcomingDeliveries?: number;
}

export interface IClientAccountSubscriptionSummary {
  subscriptionId?: string;
  subscriptionStatus?: string;
  status?: string;
  startDate?: string;
  subscriptionStartDate?: string;
  endDate?: string;
  subscriptionEndDate?: string;
  activeMealPlanName?: string;
  activeMealPlan?: string;
  mealPlanName?: string;
  averageCalories?: number;
  calories?: number;
  mealsPerDay?: number;
  remainingDays?: number;
  totalDeliveredMeals?: number;
  upcomingDeliveries?: number;
}

export interface IClientAccountSubscriptionSummaryDetails
  extends IBaseResponseDetailsDto<IClientAccountSubscriptionSummary> {}

export interface IDeliveryCalendarCutoffSettings {
  enableCutoffRestriction: boolean;
  offsetSubscriptionDays?: number;
  cutoffTimeUtc?: string;
  /** @deprecated Prefer offsetSubscriptionDays + cutoffTimeUtc */
  cutoffValue?: number;
  /** @deprecated Prefer offsetSubscriptionDays + cutoffTimeUtc */
  cutoffUnit?: string;
}

export interface IDeliveryCalendarCutoffSettingsDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarCutoffSettings> {}

export interface IUpdateDeliveryCalendarCutoffSettingsPayload {
  clientId: string;
  enableCutoffRestriction: boolean;
  offsetSubscriptionDays?: number;
  cutoffTimeUtc?: string;
  cutoffValue?: number;
  cutoffUnit?: string;
}

export interface IDeliveryCalendarDay {
  date: string;
  /** API returns string labels (e.g. "Pending", "Delivered"); legacy responses may use numbers. */
  status: number | string;
  scheduleLabel?: string | null;
  mealCount: number;
  dailySelectionId: string | null;
}

export interface IDeliveryCalendarSummary {
  delivered: number;
  pending: number;
  skipped: number;
  moved: number;
  cancelled?: number;
  paused?: number;
}

export interface IDeliveryCalendarData {
  month: number;
  year: number;
  summary: IDeliveryCalendarSummary;
  days: IDeliveryCalendarDay[];
}

export interface IDeliveryCalendarDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarData> {}

export interface IDeliveryCalendarArgs {
  clientId: string;
  month: number;
  year: number;
  status?: number | string;
}

export interface IDeliveryCalendarDayMeal {
  /** Daily meal selection row id used in replace-meals payloads as `dailyMealSelectionId`. */
  id: string;
  mealTypeId: string;
  mealTypeName: string;
  mealName: string;
  mealSelectionType: string;
  mealId: string;
  qty: number;
  basePrice: number;
  adjustedPrice: number | null;
  lineTotal: number;
  isPaid: boolean;
  isCancelled: boolean;
}

export interface IDeliveryCalendarDayCutoffSettings {
  enableCutoffRestriction: boolean;
  offsetSubscriptionDays: number;
  cutoffTimeUtc: string;
}

export interface IDeliveryCalendarDayDetail {
  date: string;
  status: number | string;
  deliveryPaymentMethod: string;
  scheduleLabel: string;
  activeMealPlanName: string;
  averageCalories: number;
  replacementDate: string | null;
  dailySelectionId: string | null;
  meals: IDeliveryCalendarDayMeal[];
  cutoffSettings: IDeliveryCalendarDayCutoffSettings;
  lastPayment: unknown | null;
}

export interface IDeliveryCalendarDayDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarDayDetail> {}

export interface IDeliveryCalendarDayArgs {
  clientId: string;
  date: string;
}

export interface IChangeDeliveryCalendarPaymentMethodPayload {
  clientId: string;
  date: string;
  paymentMethod: string;
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface ICancelDeliveryCalendarPayload {
  clientId: string;
  date: string;
  scope: number;
  mealTypeIds: string[];
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IMoveDeliveryCalendarPayload {
  clientId: string;
  date: string;
  newDeliveryDate: string;
  scope: number;
  mealTypeIds: string[];
  /** When true, backend should skip cutoff validation for the new delivery date. */
  bypassCutoff?: boolean;
  /** When true, backend should skip resume-window validation so admins can move freely. */
  bypassResumeWindow?: boolean;
}

export interface IPauseDeliveryCalendarPayload {
  clientId: string;
  date: string;
  scope: number;
  bypassCutoff?: boolean;
}

export interface IResumeDeliveryCalendarPayload {
  clientId: string;
  resumeDate: string;
  bypassResumeWindow?: boolean;
  bypassCutoff?: boolean;
}

export interface IDeliveryCalendarPauseStatus {
  isPaused: boolean;
  pauseDate: string | null;
  maxAllowedResumeDate: string | null;
  pausedDayCount: number;
}

export interface IDeliveryCalendarPauseStatusDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarPauseStatus> {}

export interface IAddDeliveryCalendarItem {
  mealId: string;
  quantity: number;
}

export type DeliveryCalendarPaymentProvider = "Stripe" | "Tamara";

export type DeliveryCalendarAddOnCategory =
  | "Meals"
  | "Snacks"
  | "Drinks"
  | "Supplements";

export interface IDeliveryCalendarAddOnOption {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
  unitPrice: number;
  category: DeliveryCalendarAddOnCategory;
}

export interface IDeliveryCalendarAddOnOptionsDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarAddOnOption[]> {}

export interface IDeliveryCalendarAddOnOptionsArgs {
  clientId: string;
  category?: DeliveryCalendarAddOnCategory;
}

export interface ISubscriptionWizardAddOnOptionsArgs {
  category: DeliveryCalendarAddOnCategory;
}

export interface ISubscriptionWizardAddOnOptionsDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarAddOnOption[]> {}

export interface IAddDeliveryCalendarItemsPayload {
  clientId: string;
  date: string;
  /** 0 = This day only, 1 = All upcoming days */
  scope: number;
  items: IAddDeliveryCalendarItem[];
  waivePayment: boolean;
  /** Required when waivePayment is false. Do not send paymentMethodId. */
  paymentProvider?: DeliveryCalendarPaymentProvider;
  paymentMethodId?: string;
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IPreviewAddDeliveryCalendarItemsPayload {
  clientId: string;
  date: string;
  /** 0 = This day only, 1 = All upcoming days */
  scope: number;
  items: IAddDeliveryCalendarItem[];
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IChangeDeliveryCalendarMealSlot {
  mealTypeId: string;
  enabled: boolean;
  quantityPerDay: number;
}

export interface IChangeDeliveryCalendarMealPlanPayload {
  clientId: string;
  date: string;
  mealPlanId: string;
  planVariant: string;
  calorieTarget: number;
  mealsPerDay: number;
  mealSlots: IChangeDeliveryCalendarMealSlot[];
  applyStartingFromThisDay: boolean;
  waivePayment: boolean;
  /** Required when waivePayment is false. Do not send paymentMethodId. */
  paymentProvider?: DeliveryCalendarPaymentProvider;
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IPreviewChangeDeliveryCalendarMealPlanPayload {
  clientId: string;
  date: string;
  mealPlanId: string;
  mealSlots: IChangeDeliveryCalendarMealSlot[];
  applyStartingFromThisDay: boolean;
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IReplaceDeliveryCalendarMeal {
  dailyMealSelectionId: string;
  mealId: string;
  /** Required for plan meals; omit for add-on replacements. */
  dailyMenuMealId?: string;
}

export interface IReplaceDeliveryCalendarMealsPayload {
  clientId: string;
  date: string;
  replacements: IReplaceDeliveryCalendarMeal[];
  paymentMethodId: string;
  waivePayment: boolean;
  bypassCutoff: boolean;
}

export interface IPreviewReplaceDeliveryCalendarMealsPayload {
  clientId: string;
  date: string;
  replacements: IReplaceDeliveryCalendarMeal[];
  /** When true, backend should skip cutoff validation for the target delivery date. */
  bypassCutoff?: boolean;
}

export interface IReplaceMealsPreviewLine {
  dailyMealSelectionId: string;
  mealTypeName: string;
  currentMealName: string | null;
  newMealName: string;
  basePrice: number;
  newMenuPrice: number;
  upgradeCost: number;
}

export interface IReplaceDeliveryCalendarMealsPreview {
  date: string;
  lines: IReplaceMealsPreviewLine[];
  totalUpgradeCost: number;
  requiresPayment: boolean;
}

export interface IDeliveryCalendarActionPreviewLine {
  mealId?: string;
  mealName?: string;
  nameEn?: string;
  nameAr?: string;
  name?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
  amount?: number;
}

export interface IDeliveryCalendarActionPreview {
  date?: string;
  totalPrice?: number;
  requiresPayment?: boolean;
  lines?: IDeliveryCalendarActionPreviewLine[];
  items?: IDeliveryCalendarActionPreviewLine[];
  subtotal?: number;
  total?: number;
  grandTotal?: number;
  totalAmount?: number;
  amountDue?: number;
  paymentRequired?: boolean;
  /** Change meal plan preview fields */
  currentPlanTotal?: number;
  newPlanTotal?: number;
  periodDifference?: number;
  proratedChargeAmount?: number;
  chargedDays?: number;
  oneDayProratedAmount?: number;
  applyStartingFromThisDay?: boolean;
}

export interface IReplaceDeliveryCalendarMealsPreviewDetails
  extends IBaseResponseDetailsDto<IReplaceDeliveryCalendarMealsPreview> {}

export interface IDeliveryCalendarActionPreviewDetails
  extends IBaseResponseDetailsDto<IDeliveryCalendarActionPreview> {}

export interface IClientAccountActivityLog {
  id: string;
  action: string;
  actionType: number;
  performedBy: string;
  previousValue: string;
  newValue: string;
  date: string;
  time: string;
  createdOn: string;
}

export interface IClientAccountActivityLogsArgs {
  clientId: string;
  search?: string;
  action?: string;
  actionType?: number;
  previousValue?: string;
  newValue?: string;
  date?: string;
  time?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface IClientAccountActivityLogsListDto {
  data: IClientAccountActivityLog[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: string[];
  succeeded: boolean;
}

export interface IClientAccountAccessData {
  clientId: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  birthDate: string;
  isActive: boolean;
  bmi: number;
  bmr: number;
  bodyFat: number;
  tdee: number;
  heightInCM: number;
  weightInKG: number;
  targetWeightInKG: number;
  dietitianGoal: string;
  timeToReachGoalInDays: number;
  neededCaloriesToReachGoal: number;
  allergens: IAllergens[];
  deliveryAddresses: IClientAccountAccessDeliveryAddress[] | unknown[];
  subscription: IClientAccountAccessSubscription | null;
  accessControl: IClientAccountAccessControl;
}

export interface IClientAccountAccessDetails
  extends IBaseResponseDetailsDto<IClientAccountAccessData> {}

export type SubscriptionWizardMode = "New" | "Renew";

export interface IStartSubscriptionWizardPayload {
  clientId: string;
  wizardMode: SubscriptionWizardMode;
}

export interface ISubscriptionWizardDraft {
  id: string;
  clientId: string;
  wizardMode: SubscriptionWizardMode;
  currentStep: string;
  renewalStrategy: string | null;
  status: string;
  hasActiveSubscription: boolean;
  activeSubscriptionEndDate: string | null;
  activeMealPlanName: string | null;
  hasUpcomingSubscription?: boolean;
  upcomingSubscriptionId?: string | null;
  upcomingSubscriptionStartDate?: string | null;
  upcomingSubscriptionEndDate?: string | null;
  upcomingMealPlanName?: string | null;
  upcomingSelectedDeliveryDates?: string[];
  mealPlanId: string | null;
  planVariant: string | null;
  calorieTarget: number | null;
  proteinTargetG: number | null;
  mealTypeSelections: ISubscriptionWizardMealTypeSelection[] | string[];
  addOnItems: ISubscriptionWizardAddOnItem[];
  subscriptionType: string | null;
  skipSaturdays: boolean;
  skipSundays: boolean;
  selectedDeliveryDates: string[];
  selectedDeliveryDays: string[];
  preferredDeliveryTime: string | null;
  clientLocationId: string | null;
  promoCode: string | null;
  manualDiscountAed: number;
  customerEmail: string | null;
  optionalMessage: string | null;
  scheduledStartDate: string | null;
}

export interface ISubscriptionWizardDraftDetails
  extends IBaseResponseDetailsDto<ISubscriptionWizardDraft> {}

export type IStartSubscriptionWizardDetails = ISubscriptionWizardDraftDetails;

export interface IUpdateSubscriptionWizardRenewalOptionsPayload {
  draftId: string;
  renewalStrategy?: string;
  scheduledStartDate?: string;
}

export interface ISubscriptionWizardMealMacroInstance {
  proteinGrams: number;
  carbsGrams: number;
  fiberGrams: number;
}

export interface ISubscriptionWizardMealTypeSelection {
  mealTypeId: string;
  name: string;
  quantityPerDay: number;
  /** Customize plan: total grams for this meal type (sum of instances) */
  proteinGrams?: number;
  carbsGrams?: number;
  fiberGrams?: number;
  /** One entry per quantity unit (Customize) */
  macroInstances?: ISubscriptionWizardMealMacroInstance[];
}

/** One customized meal slot (e.g. Breakfast #1 with its own protein/carbs/fiber). */
export interface ICustomMealInstance {
  localId: string;
  mealTypeId: string;
  name: string;
  proteinG: number | "";
  carbsG: number | "";
  fiberG: number | "";
}

export interface ISubscriptionWizardAddOnItem {
  itemId: string;
  nameEn: string;
  nameAr: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export interface IUpdateSubscriptionWizardConfigurationPayload {
  draftId: string;
  mealPlanId: string;
  planVariant: string;
  calorieTarget: number;
  proteinTargetG: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fiberGrams?: number;
  mealTypeSelections: ISubscriptionWizardMealTypeSelection[];
  addOnItems: ISubscriptionWizardAddOnItem[];
}

export interface IUpdateSubscriptionWizardSchedulePayload {
  draftId: string;
  subscriptionType: string;
  skipSaturdays: boolean;
  skipSundays: boolean;
  selectedDeliveryDates: string[];
  preferredDeliveryTime: string;
  clientLocationId: string;
  promoCode?: string;
  manualDiscountAed: number;
  scheduledStartDate: string;
}

export interface ISubscriptionWizardPreview {
  planName: string;
  planDuration: string;
  mealsPerDay: number;
  deliveryAddress: string | null;
  planAmount: number;
  addOnAmount: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  averageCalories: number;
  startDate: string;
  endDate: string;
}

export interface ISubscriptionWizardPreviewDetails
  extends IBaseResponseDetailsDto<ISubscriptionWizardPreview> {}

export interface IUpdateSubscriptionWizardBillingPayload {
  draftId: string;
  customerEmail: string;
  optionalMessage?: string;
}

export type SubscriptionWizardPaymentProvider = "Stripe" | "Tamara";

export interface IFinalizeSubscriptionWizardPayload {
  draftId: string;
  paymentProvider: SubscriptionWizardPaymentProvider;
}

export interface ISubscriptionWizardMealPlan {
  id: string;
  nameEn: string;
  nameAr: string;
  monthlyPrice: number;
  mealTypesCount: number;
  averageCalories: number;
}

export interface ISubscriptionWizardMealPlansDetails
  extends IBaseResponseDetailsDto<ISubscriptionWizardMealPlan[]> {}

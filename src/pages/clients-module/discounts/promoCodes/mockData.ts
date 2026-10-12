/** @format */

import {
  IPromoCode,
  IPromoPlanOption,
  PromoApplyMode,
  PromoDuration,
  PromoEligibilityType,
  PromoRewardType,
  PromoSubscriptionType,
  PROMO_SUBSCRIPTION_TYPE_OPTIONS,
} from "src/types/modules/clientsManagement/discounts/promoCodes";

export {
  MOCK_PROMO_BANKS,
  getActivePromoBanks,
  getBankNames,
} from "../banks/mockData";

export const MOCK_PROMO_PLANS: IPromoPlanOption[] = [
  { id: "plan-weight-loss", nameEn: "Weight Loss", nameAr: "إنقاص الوزن" },
  { id: "plan-lifestyle", nameEn: "Lifestyle", nameAr: "نمط الحياة" },
  { id: "plan-muscle", nameEn: "Muscle Gain", nameAr: "بناء العضلات" },
  { id: "plan-custom", nameEn: "Customized", nameAr: "مخصص" },
];

const mockAuditFields = {
  createdBy: "",
  lastModifiedBy: "",
  deletedOn: "",
  deletedBy: "",
  deletedByName: "",
  activationChangedOn: "",
  activationChangedBy: "",
  activationChangedByName: "",
};

/** Mutable mock store for Promo Codes UI (parallel to Discount Rules). */
export let MOCK_PROMO_CODES: IPromoCode[] = [
  {
    id: "promo-001",
    code: "GET20OFF",
    percentOff: 20,
    amountOff: 0,
    stripeId: null,
    duration: PromoDuration.Once,
    durationInMonths: 0,
    startDate: "2026-08-01",
    expirationDate: "2026-12-31",
    maxRedemptions: 1000,
    redemptionsUsed: 42,
    maxRedemptionsPerClient: 1,
    firstTimeClientsOnly: false,
    isActive: true,
    isPublished: false,
    descriptionEn: "20% off on all meal plans over 500 credits.",
    descriptionAr: "خصم 20% على جميع خطط الوجبات فوق 500 رصيد.",
    applyMode: PromoApplyMode.Manual,
    eligibilityType: PromoEligibilityType.All,
    rewardType: PromoRewardType.Percent,
    bankIds: [],
    planIds: ["plan-weight-loss", "plan-lifestyle", "plan-muscle", "plan-custom"],
    subscriptionTypes: [
      PromoSubscriptionType.OneWeek,
      PromoSubscriptionType.OneMonth,
      PromoSubscriptionType.ThreeMonths,
    ],
    minOrderCredits: 500,
    buyQuantity: null,
    getQuantity: null,
    createdOn: "2026-07-20T10:00:00Z",
    lastModifiedOn: "2026-08-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
  {
    id: "promo-002",
    code: "EMIRATES NBD",
    percentOff: 50,
    amountOff: 0,
    stripeId: "stripe_mock_1",
    duration: PromoDuration.Forever,
    durationInMonths: 0,
    startDate: "2026-08-01",
    expirationDate: "2026-12-31",
    maxRedemptions: null,
    redemptionsUsed: 12,
    maxRedemptionsPerClient: 1,
    firstTimeClientsOnly: false,
    isActive: true,
    isPublished: true,
    descriptionEn: "Get a 50% OFF for payments using Emirates Bank.",
    descriptionAr: "احصل على خصم 50% للدفع عبر بنك الإمارات.",
    applyMode: PromoApplyMode.AutoOnBank,
    eligibilityType: PromoEligibilityType.All,
    rewardType: PromoRewardType.Percent,
    bankIds: ["bank-emirates-nbd"],
    planIds: [],
    subscriptionTypes: [PromoSubscriptionType.OneMonth],
    minOrderCredits: null,
    buyQuantity: null,
    getQuantity: null,
    createdOn: "2026-07-18T10:00:00Z",
    lastModifiedOn: "2026-07-25T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
  {
    id: "promo-003",
    code: "MASHREQ",
    percentOff: 0,
    amountOff: 0,
    stripeId: null,
    duration: PromoDuration.Once,
    durationInMonths: 0,
    startDate: "2026-08-01",
    expirationDate: "2026-12-31",
    maxRedemptions: null,
    redemptionsUsed: 3,
    maxRedemptionsPerClient: 1,
    firstTimeClientsOnly: false,
    isActive: true,
    isPublished: false,
    descriptionEn: "Buy 1 meal free, for payments using Mashreq Credit Cards",
    descriptionAr: "اشترِ وجبة واحصل على أخرى مجاناً عبر بطاقات المشرق",
    applyMode: PromoApplyMode.AutoOnBank,
    eligibilityType: PromoEligibilityType.All,
    rewardType: PromoRewardType.BuyXGetY,
    bankIds: ["bank-mashreq"],
    planIds: [],
    subscriptionTypes: [],
    minOrderCredits: null,
    buyQuantity: 1,
    getQuantity: 1,
    createdOn: "2026-07-19T10:00:00Z",
    lastModifiedOn: "2026-07-19T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
  {
    id: "promo-004",
    code: "NEWBEE10",
    percentOff: 50,
    amountOff: 0,
    stripeId: null,
    duration: PromoDuration.Once,
    durationInMonths: 0,
    startDate: "2026-08-01",
    expirationDate: "2026-10-31",
    maxRedemptions: 500,
    redemptionsUsed: 88,
    maxRedemptionsPerClient: 1,
    firstTimeClientsOnly: true,
    isActive: true,
    isPublished: false,
    descriptionEn: "Enter Code to Claim 50% OFF.",
    descriptionAr: "أدخل الرمز للحصول على خصم 50%.",
    applyMode: PromoApplyMode.Manual,
    eligibilityType: PromoEligibilityType.FirstTime,
    rewardType: PromoRewardType.Percent,
    bankIds: [],
    planIds: [],
    subscriptionTypes: [PromoSubscriptionType.OneWeek, PromoSubscriptionType.OneMonth],
    minOrderCredits: null,
    buyQuantity: null,
    getQuantity: null,
    createdOn: "2026-07-22T10:00:00Z",
    lastModifiedOn: "2026-07-22T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
  {
    id: "promo-005",
    code: "FREEMEAL",
    percentOff: 0,
    amountOff: 0,
    stripeId: null,
    duration: PromoDuration.Once,
    durationInMonths: 0,
    startDate: "2026-08-01",
    expirationDate: "2026-12-31",
    maxRedemptions: 200,
    redemptionsUsed: 15,
    maxRedemptionsPerClient: 1,
    firstTimeClientsOnly: false,
    isActive: true,
    isPublished: false,
    descriptionEn: "Buy 5 meals, get the 6th one absolutely free.",
    descriptionAr: "اشترِ 5 وجبات واحصل على السادسة مجاناً.",
    applyMode: PromoApplyMode.Manual,
    eligibilityType: PromoEligibilityType.All,
    rewardType: PromoRewardType.BuyXGetY,
    bankIds: [],
    planIds: ["plan-lifestyle", "plan-weight-loss"],
    subscriptionTypes: [PromoSubscriptionType.OneMonth, PromoSubscriptionType.ThreeMonths],
    minOrderCredits: null,
    buyQuantity: 5,
    getQuantity: 1,
    createdOn: "2026-07-21T10:00:00Z",
    lastModifiedOn: "2026-07-21T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
  {
    id: "promo-006",
    code: "FLAT50",
    percentOff: 0,
    amountOff: 50,
    stripeId: null,
    duration: PromoDuration.Repeating,
    durationInMonths: 3,
    startDate: "2026-08-01",
    expirationDate: "2026-11-30",
    maxRedemptions: 200,
    redemptionsUsed: 5,
    maxRedemptionsPerClient: 2,
    firstTimeClientsOnly: false,
    isActive: false,
    isPublished: false,
    descriptionEn: "Flat 50 off for repeating subscriptions.",
    descriptionAr: "خصم ثابت 50 للاشتراكات المتكررة.",
    applyMode: PromoApplyMode.Manual,
    eligibilityType: PromoEligibilityType.Returning,
    rewardType: PromoRewardType.Amount,
    bankIds: [],
    planIds: ["plan-custom"],
    subscriptionTypes: [PromoSubscriptionType.ThreeMonths],
    minOrderCredits: 100,
    buyQuantity: null,
    getQuantity: null,
    createdOn: "2026-07-10T10:00:00Z",
    lastModifiedOn: "2026-07-15T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
    ...mockAuditFields,
  },
];

export const getPlanNames = (planIds: string[], locale = "en-US") => {
  if (!planIds.length) return "All plans";
  return planIds
    .map((id) => MOCK_PROMO_PLANS.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => (locale === "en-US" ? p!.nameEn : p!.nameAr))
    .join(", ");
};

const SUBSCRIPTION_TYPE_LABELS: Record<
  PromoSubscriptionType,
  { en: string; ar: string }
> = {
  [PromoSubscriptionType.OneWeek]: { en: "1 Week", ar: "أسبوع واحد" },
  [PromoSubscriptionType.OneMonth]: { en: "1 Month", ar: "شهر واحد" },
  [PromoSubscriptionType.ThreeMonths]: { en: "3 Months", ar: "3 أشهر" },
};

export const getSubscriptionTypeNames = (
  subscriptionTypes: PromoSubscriptionType[] = [],
  locale = "en-US"
) => {
  if (!subscriptionTypes.length) return "All types";
  return subscriptionTypes
    .map((type) => {
      const labels = SUBSCRIPTION_TYPE_LABELS[type];
      if (!labels) return type;
      return locale === "en-US" ? labels.en : labels.ar;
    })
    .join(", ");
};

export { PROMO_SUBSCRIPTION_TYPE_OPTIONS };

export const upsertMockPromoCode = (item: IPromoCode) => {
  const index = MOCK_PROMO_CODES.findIndex((row) => row.id === item.id);
  if (index >= 0) {
    MOCK_PROMO_CODES[index] = item;
  } else {
    MOCK_PROMO_CODES = [item, ...MOCK_PROMO_CODES];
  }
};

export const removeMockPromoCode = (id: string) => {
  MOCK_PROMO_CODES = MOCK_PROMO_CODES.filter((row) => row.id !== id);
};

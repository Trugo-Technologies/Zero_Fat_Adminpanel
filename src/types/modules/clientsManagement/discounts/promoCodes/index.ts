/** @format */

import {
  IBaseUpdateDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";

export enum PromoDuration {
  Repeating = "Repeating",
  Once = "Once",
  Forever = "Forever",
}

/** How the offer appears / applies in the client app */
export enum PromoApplyMode {
  Manual = "Manual",
  AutoOnBank = "AutoOnBank",
  AutoOnEligible = "AutoOnEligible",
}

/** Who can use the promo */
export enum PromoEligibilityType {
  All = "All",
  FirstTime = "FirstTime",
  Returning = "Returning",
}

/** Discount / reward engine */
export enum PromoRewardType {
  Percent = "Percent",
  Amount = "Amount",
  BuyXGetY = "BuyXGetY",
}

/** Subscription durations the promo can apply to */
export enum PromoSubscriptionType {
  OneWeek = "OneWeek",
  OneMonth = "OneMonth",
  ThreeMonths = "ThreeMonths",
}

export const PROMO_SUBSCRIPTION_TYPE_OPTIONS = [
  { value: PromoSubscriptionType.OneWeek, labelKey: "promoCodes.subscriptionType.OneWeek" },
  { value: PromoSubscriptionType.OneMonth, labelKey: "promoCodes.subscriptionType.OneMonth" },
  { value: PromoSubscriptionType.ThreeMonths, labelKey: "promoCodes.subscriptionType.ThreeMonths" },
] as const;

export interface IPromoPlanOption {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface ICreatePromoCodeDto {
  code: string;
  descriptionEn: string;
  descriptionAr: string;
  duration: string;
  percentOff: number | null;
  amountOff: number | null;
  durationInMonths: number | null;
  startDate: string;
  expirationDate: string;
  maxRedemptions: number | null;
  maxRedemptionsPerClient: number | null;
  /** Kept in sync with eligibilityType === FirstTime */
  firstTimeClientsOnly: boolean;
  isActive: boolean;
  /** Derived from rewardType for older UI compatibility */
  isPercent: boolean;
  applyMode: PromoApplyMode;
  eligibilityType: PromoEligibilityType;
  rewardType: PromoRewardType;
  bankIds: string[];
  planIds: string[];
  /** Empty = all subscription types */
  subscriptionTypes: PromoSubscriptionType[];
  minOrderCredits: number | null;
  buyQuantity: number | null;
  getQuantity: number | null;
}

export interface IUpdatePromoCodeDto
  extends IBaseUpdateDto,
    ICreatePromoCodeDto {}

export interface IPromoCode extends IBaseAdditionalResponseDetailsDto {
  id: string;
  code: string;
  percentOff: number;
  stripeId: string | null;
  amountOff: number;
  duration: PromoDuration;
  durationInMonths: number;
  startDate: string;
  expirationDate: string | null;
  maxRedemptions: number | null;
  redemptionsUsed: number | null;
  maxRedemptionsPerClient: number | null;
  firstTimeClientsOnly: boolean;
  isActive: boolean;
  isPublished?: boolean;
  descriptionEn: string | null;
  descriptionAr: string | null;
  applyMode: PromoApplyMode;
  eligibilityType: PromoEligibilityType;
  rewardType: PromoRewardType;
  bankIds: string[];
  planIds: string[];
  subscriptionTypes: PromoSubscriptionType[];
  minOrderCredits: number | null;
  buyQuantity: number | null;
  getQuantity: number | null;
}

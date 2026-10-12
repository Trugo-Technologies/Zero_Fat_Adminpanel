/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { subscriptionType } from "src/types/enums";

export interface IDiscountRulesListDto
  extends IBaseResponseListDto<IDiscountRule> {}

export enum DiscountOfferType {
  PromoCode = "PromoCode",
  Bank = "Bank",
}

export type DiscountSubscriptionType =
  (typeof subscriptionType)[keyof typeof subscriptionType];

export const DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS = [
  {
    value: subscriptionType.OneWeek,
    labelKey: "discountRules.subscriptionType.OneWeek",
  },
  {
    value: subscriptionType.OneMonth,
    labelKey: "discountRules.subscriptionType.OneMonth",
  },
  {
    value: subscriptionType.ThreeMonths,
    labelKey: "discountRules.subscriptionType.ThreeMonths",
  },
  {
    value: subscriptionType.Custom,
    labelKey: "discountRules.subscriptionType.Custom",
  },
] as const;

export interface ICreateDiscountRuleDto {
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
  firstTimeClientsOnly: boolean;
  addToOffers: boolean;
  isActive: boolean;
  /** UI-only — maps to percentOff vs amountOff */
  isPercent: boolean;
  offerType: DiscountOfferType | string;
  /** Empty string in form; null when sent to API */
  bankId: string | null;
  /** Empty string in form; null when sent to API */
  mealPlanId: string | null;
  subscriptionTypes: DiscountSubscriptionType[];
}

export interface IUpdateDiscountRuleDto
  extends IBaseUpdateDto,
    ICreateDiscountRuleDto {}

/** Maps form values to DiscountRules create/update API body */
export const toDiscountRuleApiPayload = (
  data: ICreateDiscountRuleDto | IUpdateDiscountRuleDto
) => {
  const { isPercent: _isPercent, ...rest } = data as ICreateDiscountRuleDto & {
    id?: string;
  };
  const isBank = rest.offerType === DiscountOfferType.Bank;
  return {
    ...rest,
    offerType: rest.offerType || DiscountOfferType.PromoCode,
    bankId: isBank && rest.bankId ? rest.bankId : null,
    mealPlanId: rest.mealPlanId ? rest.mealPlanId : null,
    subscriptionTypes: rest.subscriptionTypes || [],
    addToOffers: !!rest.addToOffers,
  };
};
export interface IDiscountRuleDetailsDto
  extends IBaseResponseDetailsDto<IDiscountRule> {}

export interface IDiscountRule extends IBaseAdditionalResponseDetailsDto {
  id: string;
  code: string;
  percentOff: number;
  stripeId: string | null;
  amountOff: number;
  duration: Duration;
  durationInMonths: number;
  startDate: string;
  expirationDate: string | null;
  maxRedemptions: number | null;
  redemptionsUsed: number | null;
  maxRedemptionsPerClient: number | null;
  firstTimeClientsOnly: boolean;
  addToOffers?: boolean;
  isActive: boolean;
  /** Present when the rule has been published to Stripe. */
  isPublished?: boolean;
  descriptionEn: string | null;
  descriptionAr: string | null;
  offerType?: DiscountOfferType | string | null;
  bankId?: string | null;
  bankNameEn?: string | null;
  bankNameAr?: string | null;
  mealPlanId?: string | null;
  subscriptionTypes?: DiscountSubscriptionType[];
}

export enum Duration {
  Repeating = "Repeating",
  Once = "Once",
  Forever = "Forever",
}

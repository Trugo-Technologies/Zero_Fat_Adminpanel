/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";

export interface IDiscountRulesListDto
  extends IBaseResponseListDto<IDiscountRule> {}

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
  isActive: boolean;
  isPercent: boolean;
}

export interface IUpdateDiscountRuleDto
  extends IBaseUpdateDto,
    ICreateDiscountRuleDto {}

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
  isActive: boolean;
  descriptionEn: string | null;
  descriptionAr: string | null;
}

export enum Duration {
  Repeating = "Repeating",
  Once = "Once",
  Forever = "Forever",
}

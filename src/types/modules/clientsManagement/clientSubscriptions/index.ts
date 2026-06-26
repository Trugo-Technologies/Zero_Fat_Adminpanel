/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IClient } from "../clients";
import { IMealPlans } from "../../nutriplan/mealPlans";
import { IMealTypes } from "../../nutriplan/mealTypes";
import { IClientLocations } from "../clientLocations";

export interface IClientSubscriptionsListDto
  extends IBaseResponseListDto<IClientSubscriptions> {}

export interface IClientSubscriptionsDetails
  extends IBaseResponseDetailsDto<IClientSubscriptions> {}

export interface IClientSubscriptions
  extends IBaseAdditionalResponseDetailsDto {
  id: string;
  daysPerWeek: Array<number>;
  totalCost: number;
  averageCalories: number;
  lastDeliveryDate: string;
  clientLocationId: string;
  startDate: string;
  endDate: string;
  client: IClient;
  mealPlan: IMealPlans;
  ClientSubscriptionstatus: string;
  subscriptionStatus: string;
  paymentQuickLink: string;
  subscriptionType: string;
  selectedMealTypes: Array<ISelectedMealTypes>;
  paymentStatus: string;
  //new
  clientLocation: IClientLocations;
  cancelAt: string | null;
  isAutoRenewalEnabled: boolean;
  nextRenewalDate: string | null;
  paymentDate: string | null;
  preferredDeliveryTime: PreferredDeliveryTime;
  renewalCount: number;
  selectedDeliveryDays: Array<number>;
  lastSyncDate?: string;
  lastStatusUpdate?: string;
}

export interface ISelectedMealTypes {
  mealType: IMealTypes;
  notes: string;
  quantityPerDay: number;
}

export enum PreferredDeliveryTime {
  EarlyMorning = "EarlyMorning",
  Morning = "Morning",
  Evening = "Evening",
}

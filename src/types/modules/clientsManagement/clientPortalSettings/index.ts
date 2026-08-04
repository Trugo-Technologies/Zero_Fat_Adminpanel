import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
} from "src/types/baseEntity";

export interface IUpdateClientPortalSettings extends IClientPortalSettings {}

export interface IClientPortalSettingsDetails
  extends IBaseResponseDetailsDto<IClientPortalSettings> {}

export interface IClientPortalSettings {
  nutriPlanStartegy: string;
  offsetSubscriptionInDays: number | null;
  cutoffTime?: string | null;
  weeklyCaloricDeficit: number | null;
  weeklyCaloricSurplus: number | null;
  onePointEqualInMoney: number | null;
  defaultNutriPlanTimeAvailable: number | null;
  monthlyPackageSubsciptionDiscount: number | null;
  minimumSubsciption: number | null;
  threeMonthlyPackageSubsciptionDiscount: number | null;
  enableDailyMealSelections?: boolean;
}

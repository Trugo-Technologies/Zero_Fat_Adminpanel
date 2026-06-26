/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IAllergens } from "../../nutriplan/allergens";

export interface IClientsListDto extends IBaseResponseListDto<IClient> {}

export interface IClientDetails
  extends IBaseResponseDetailsDto<IClient>,
    IClient {}

export interface IClient extends IBaseAdditionalResponseDetailsDto {
  id: string;
  fullName: string;
  gender: string;
  mobile: string;
  birthDate: string;
  email: string;
  subscriptionStatus: string;
  heightInCM: number;
  weightInKG: number;
  targetWeightInKG: number;
  dietitianGoal: string;
  activityValue: number;
  bmi: number;
  bmr: number;
  bodyFat: number;
  tdee: number;
  timeToReachGoalInDays: number;
  neededCaloriesToReachGoal: number;
  clientAllergics: Array<IAllergens>;
  imageUrl: string;
  isActive: boolean;
}

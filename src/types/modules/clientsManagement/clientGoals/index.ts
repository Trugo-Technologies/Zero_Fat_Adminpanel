import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface IClientGoalsListDto
  extends IBaseResponseListDto<IClientGoals> {}

export interface IClientGoalsDetails
  extends IBaseResponseDetailsDto<IClientGoals> {}

export interface IClientGoals extends IBaseAdditionalResponseDetailsDto {
  id: string;
  heightInCM: number;
  weightInKG: number;
  targetWeightInKG: number;
  activityValue: number;
  bmi: number;
  bmr: number;
  bodyFat: number;
  tdee: number;
  bodytimeToReachGoalInDaysat: number;
  neededCaloriesToReachGoal: number;
  dietitianGoal: string;
  heightMeasurement: string;
  weightMeasurement: string;
  targetWeightMeasurement: string;
}

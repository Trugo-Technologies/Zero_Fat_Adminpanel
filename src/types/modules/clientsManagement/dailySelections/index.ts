/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IClient } from "../clients";
import { IClientLocations } from "../clientLocations";
import { IMeals } from "../../nutriplan/mealPlanning/meals";

export interface IDailySelectionsListDto
  extends IBaseResponseListDto<IDailySelections> {}

export interface IDailySelectionsDetails
  extends IBaseResponseDetailsDto<IDailySelections> {}

export interface IDailySelections extends IBaseAdditionalResponseDetailsDto {
  id: string;
  date: string;
  notes: string;
  deliveryTime: string;
  dailySelectionStatus: string;
  totalCalories: number;
  totalFats: number;
  totalCarbohydrates: number;
  totalProteins: number;
  client: IClient;
  clientLocation: IClientLocations;
  mealTypes: Array<{
    nameEn: string;
    nameAr: string;
    index: number;
    dailyMealSelections: Array<{
      id: string;
      totalCalories: number;
      totalFats: number;
      totalCarbohydrates: number;
      totalProteins: number;
      specialInstructions: string;
      meal: IMeals;
    }>;
  }>;
  // new
  hasCutlery: boolean;
}

/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IClient } from "../clients";
import { IClientLocations } from "../clientLocations";
import { IMeals } from "../../nutriplan/mealPlanning/meals";

export interface IDailyMealSelectionsListDto
  extends IBaseResponseListDto<IDailyMealSelections> {}

export interface IDailyMealSelectionsDetails
  extends IBaseResponseDetailsDto<IDailyMealSelections> {}

export interface ICustomMeal {
  id: string;
  imageUrl: string;
  nameAr: string;
  nameEn: string;
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalPrice: number;
  totalProtein: number;
  selectedOptions: [
    {
      optionId: string;
      quantity: number;
      option: {
        imageUrl: string;
        id: string;
        priceAdjustment: string;
        nameAr: string;
        nameEn: string;
        group: {
          imageUrl: string;
          id: string;
          nameAr: string;
          nameEn: string;
        };
      };
    },
  ];
}
export interface IDailyMealSelections
  extends IBaseAdditionalResponseDetailsDto {
  id: string;
  date: string;
  notes: string;
  deliveryTime: string;
  mealSelectionType: string;
  customMeal: ICustomMeal | null;
  totalCalories: number;
  totalFats: number;
  totalCarbohydrates: number;
  totalProteins: number;
  specialInstructions: string;
  deliveryDate: string;
  client: IClient;
  clientLocation: IClientLocations;
  isMealSwapped: boolean;
  meal: IMeals;
}

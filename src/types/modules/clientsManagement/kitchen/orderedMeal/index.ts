import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IClient } from "../../clients";
import { IClientLocations } from "../../clientLocations";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";

export interface IKitchenOrderedMealListDto
  extends IBaseResponseListDto<IKitchenOrderedMeal> {}

export interface IKitchenOrderedMealDetails
  extends IBaseResponseDetailsDto<IKitchenOrderedMeal> {}

export interface IKitchenOrderedMeal extends IBaseAdditionalResponseDetailsDto {
  id: string;
  date: string;
  notes: string;
  deliveryTime: string;
  totalCalories: number;
  totalFats: number;
  totalCarbohydrates: number;
  totalProteins: number;
  specialInstructions: string;
  deliveryDate: string;
  client: IClient;
  clientLocation: IClientLocations;
  isMealSwapped: boolean;
  meal: Array<IMeals>;
}

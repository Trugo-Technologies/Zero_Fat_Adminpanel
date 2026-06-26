import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IMeals } from "../../../nutriplan/mealPlanning/meals";

export interface IKitchenMealCountListDto
  extends IBaseResponseListDto<IKitchenMealCount> {}

export interface IKitchenMealCountDetails
  extends IBaseResponseDetailsDto<IKitchenMealCount> {}

export interface IKitchenMealCount extends IBaseAdditionalResponseDetailsDto {
  id: string;
  date: string;
  meal: IMeals;
  requestCount: number;
}

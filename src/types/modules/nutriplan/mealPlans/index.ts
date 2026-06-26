import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from 'src/types/baseEntity';
import { IMealTypes } from '../mealTypes';

export interface IMealPlansListDto extends IBaseResponseListDto<IMealPlans> {}

export interface ICreateMealPlanDto {
  nameAr: string;
  nameEn: string;
  code: string;
  defaultDietitianGoal: string;
  carbPercentage: number | null;
  proteinPercentage: number | null;
  fatPercentage: number | null;
  // mealPlans: Array<string>;
  // mealPlansItems?: Array<IMealPlans>;
  descriptionEn: string;
  descriptionAr: string;
  mainImage?: string | File;
  images?: Array<string | File>;
  isActive: boolean;
  mealTypes: Array<{
    mealType: IMealTypes | null;
    mealTypeId: string;
    averageCalories: number | null;
    price: number | null;
  }>;
}

export interface IUpdateMealPlanDto extends IBaseUpdateDto, ICreateMealPlanDto {
  imageUrl: string;
}

export interface IMealPlansDetailsDto
  extends IBaseResponseDetailsDto<IMealPlans> {}

export interface IMealPlans extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  descriptionEn: string;
  descriptionAr: string;
  defaultDietitianGoal: string;
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  MealPlans: Array<IMealPlans>;
  mainImageUrl: string | null;
  imageUrl: string;
  images: Array<string>;
  isActive: boolean;
  mealPlanMealTypes: Array<{
    mealType: IMealTypes | null;
    mealTypeId: string;
    averageCalories: number | null;
    price: number | null;
  }>;
}

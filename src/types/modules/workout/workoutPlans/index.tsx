import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";
import { ITrainer } from "../../training/trainers";
import { IPlanGoal } from "../planGoals";
import { ICategories } from "../../nutriplan/categories";

export interface IWorkoutPlansListDto
  extends IBaseResponseListDto<IWorkoutPlans> {}

export interface IWorkoutPlansCreateDto {
  nameAr: string;
  nameEn: string;
  avatarImage: string;
  profileMedia: string;
  daysPerWeek: number | null;
  equipmentCategoryId: string;
  equipmentCategory: ICategories | null;

  weeklyRepetition: number | null;
  trainerId: string;
  planGoalId: string;
  environment: string;
  trainer: ITrainer | null;
  planGoal: IPlanGoal | null;
  level: string;
  overviewAr: string;
  overviewEn: string;
  planConclusionEn: string;
  planConclusionAr: string;
  restDays: Array<number>;
  isActive: boolean;
}
export interface IUpdateWorkoutPlansDto
  extends IBaseUpdateDto,
    IWorkoutPlansCreateDto {
  avatarImageUrl?: string;
  profileMediaUrl?: string;
}

export interface IWorkoutPlansDetailsDto
  extends IWorkoutPlans,
    IBaseResponseDetailsDto<IWorkoutPlans> {}

export interface IWorkoutPlans extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  avatarImageUrl: string;
  environment: string;
  profileMediaUrl: string;
  daysPerWeek: number;
  equipmentCategory: ICategories | null;
  restDays: Array<number>;

  level: string;
  isActive: boolean;
  weeklyRepetition: number;
  planConclusionEn: string;
  planConclusionAr: string;
  overviewAr: string;
  overviewEn: string;
  trainerId: string;
  planGoalId: string;
  trainer: ITrainer;
  planGoal: IPlanGoal;
}

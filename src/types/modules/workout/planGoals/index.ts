import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface IPlanGoalsListDto extends IBaseResponseListDto<IPlanGoal> {}

export interface ICreatePlanGoalDto {
  nameAr: string;
  nameEn: string;
  image?: string;

  isActive: boolean;
}

export interface IUpdatePlanGoalDto extends IBaseUpdateDto, ICreatePlanGoalDto {
  imageUrl?: string;
}

export interface IPlanGoalDetailsDto extends IBaseResponseDetailsDto<IPlanGoal> {}

export interface IPlanGoal extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  imageUrl?: string;
  isActive: boolean;
}

import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface IWorkoutTypesListDto extends IBaseResponseListDto<IWorkoutType> {}

export interface ICreateWorkoutTypeDto {
  nameAr: string;
  nameEn: string;
  icon?: string;

  isActive: boolean;
}

export interface IUpdateWorkoutTypeDto extends IBaseUpdateDto, ICreateWorkoutTypeDto {
  iconUrl?: string;
}

export interface IWorkoutTypeDetailsDto extends IBaseResponseDetailsDto<IWorkoutType> {}

export interface IWorkoutType extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  iconUrl?: string;
  isActive: boolean;
}

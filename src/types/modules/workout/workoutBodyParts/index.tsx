import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface IWorkoutBodyPartsListDto extends IBaseResponseListDto<IWorkoutBodyPart> {}

export interface ICreateWorkoutBodyPartDto {
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

export interface IUpdateWorkoutBodyPartDto extends IBaseUpdateDto, ICreateWorkoutBodyPartDto {}

export interface IWorkoutBodyPartDetailsDto extends IBaseResponseDetailsDto<IWorkoutBodyPart> {}

export interface IWorkoutBodyPart extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

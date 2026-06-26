import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from 'src/types/baseEntity';

export interface IMealTypesListDto extends IBaseResponseListDto<IMealTypes> {}

export interface ICreateMealTypesDto {
  nameAr: string;
  nameEn: string;
  icon: string | File;
  image: string | File;
}

export interface IUpdateMealTypeDto
  extends IBaseUpdateDto,
    ICreateMealTypesDto {}

export interface IMealTypesDetailsDto
  extends IBaseResponseDetailsDto<IMealTypes> {}

export interface IMealTypes extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  index: number;
  iconUrl: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

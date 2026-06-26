import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface IAllergensListDto extends IBaseResponseListDto<IAllergens> {}

export interface ICreateAllergensDto {
  nameAr: string;
  nameEn: string;
  icon:string|File
}

export interface IUpdateAllergenDto extends IBaseUpdateDto, ICreateAllergensDto {}

export interface IAllergensDetailsDto extends IBaseResponseDetailsDto<IAllergens> {}

export interface IAllergens extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  iconUrl: string|null
}

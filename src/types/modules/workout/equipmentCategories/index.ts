import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface IEquipmentCategoriesListDto extends IBaseResponseListDto<IEquipmentCategory> {}

export interface ICreateEquipmentCategoryDto {
  nameAr: string;
  nameEn: string;
  icon?: string;

  isActive: boolean;
}

export interface IUpdateEquipmentCategoryDto extends IBaseUpdateDto, ICreateEquipmentCategoryDto {
  iconUrl?: string;
}

export interface IEquipmentCategoryDetailsDto extends IBaseResponseDetailsDto<IEquipmentCategory> {}

export interface IEquipmentCategory extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  iconUrl?: string;
  isActive: boolean;
}

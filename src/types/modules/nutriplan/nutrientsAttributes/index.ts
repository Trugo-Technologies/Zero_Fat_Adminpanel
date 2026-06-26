import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface INutrientsAttributesListDto extends IBaseResponseListDto<INutrientsAttributes> {}

export interface ICreateNutrientsAttributesDto {
  nameAr: string;
  nameEn: string;
  unit: string;
}

export interface IUpdateNutrientsAttributesDto extends IBaseUpdateDto, ICreateNutrientsAttributesDto {}

export interface INutrientsAttributesDetailsDto extends IBaseResponseDetailsDto<INutrientsAttributes> {}

export interface INutrientsAttributes extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  unit: string;
}

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IFaqCategoriesListDto
  extends IBaseResponseListDto<IFaqCategories> {}

export interface ICreateFaqCategories {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}
export interface IUpdateFaqCategories
  extends IBaseUpdateDto,
    ICreateFaqCategories {}

export interface IFaqCategoriesDetails
  extends IBaseResponseDetailsDto<IFaqCategories> {}

export interface IFaqCategories extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}

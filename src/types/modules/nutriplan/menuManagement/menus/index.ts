/** @format */

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";

export interface IMenusListDto extends IBaseResponseListDto<IMenus> {}

export interface ICreateMenusDto {
  nameAr: string;
  nameEn: string;
  isPublished: boolean;
  startDate: string;
  endDate: string;
}

export interface ICopyMenusDto {
  nameAr: string;
  nameEn: string;
  isPublished: boolean;
  startDate: string;
  menuId: string;
}

export interface IUpdateMenuDto extends IBaseUpdateDto, ICreateMenusDto {}

export interface IMenusDetailsDto extends IBaseResponseDetailsDto<IMenus> {}

export interface IMenus extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  isPublished: boolean;
  startDate: string;
  endDate: string;
}

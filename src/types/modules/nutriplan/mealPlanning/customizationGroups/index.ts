/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface ICustomizationGroup extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  displayOrder: number;
  proteinAdjustment: number;
  carbsAdjustment: number;
  fatAdjustment: number;
  caloriesAdjustment: number;
  isRequired: boolean;
}

export interface ICustomizationGroupsListDto
  extends IBaseResponseListDto<ICustomizationGroup> {}

export interface ICreateCustomizationGroupDto {
  nameAr: string;
  nameEn: string;
  image: string;
  displayOrder: number | null;
  proteinAdjustment: number | null;
  carbsAdjustment: number | null;
  fatAdjustment: number | null;
  caloriesAdjustment: number | null;
  isRequired: boolean;
}

export interface IUpdateCustomizationGroupDto
  extends IBaseUpdateDto,
    ICreateCustomizationGroupDto {
  imageUrl: string;
}

export interface ICustomizationGroupDetailsDto
  extends IBaseResponseDetailsDto<ICustomizationGroup> {}

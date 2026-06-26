/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IBanner extends IBaseAdditionalResponseDetailsDto {
  id: string;
  titleAr: string;
  titleEn: string;
  index: number;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  isActive: boolean;
}

export interface IBannerListDto extends IBaseResponseListDto<IBanner> {}

export interface ICreateBanner {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  isActive: boolean;
}
export interface IUpdateBanner extends IBaseUpdateDto, ICreateBanner {
  imageUrl?: string;
  index: number;
}

export interface IBannerDetails extends IBaseResponseDetailsDto<IBanner> {}

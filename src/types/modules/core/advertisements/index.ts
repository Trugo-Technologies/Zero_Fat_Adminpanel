import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IAdvertisements extends IBaseAdditionalResponseDetailsDto {
  id: string;
  titleEn: string;
  titleAr: string;
  index: number;
  descriptionEn: string;
  descriptionAr: string;
  welcomeMsgAr: string;
  welcomeMsgEn: string;
  imageUrl: string;
  isActive: boolean;
}

export interface ICreateAdvertisement {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  welcomeMsgAr: string;
  welcomeMsgEn: string;
  image: string;
  isActive: boolean;
}
export interface IUpdateAdvertisement
  extends IBaseUpdateDto,
    ICreateAdvertisement {
  imageUrl?: string;
}
export interface IAdvertisementsListDto
  extends IBaseResponseListDto<IAdvertisements> {}

export interface IAdvertisementsDetailsDto
  extends IBaseResponseDetailsDto<IAdvertisements> {}

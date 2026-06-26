import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IPhysicalActivityLevels
  extends IBaseAdditionalResponseDetailsDto {
  id: string;
  imageUrl: string;
  descriptionAr: string;
  descriptionEn: string;
  exampleEn: string;
  exampleAr: string;
  activityValue: number;
  isActive: true;
  createdOn: string;
  createdByName: string;
  lastModifiedByName: string;
  lastModifiedOn: string;
}

export interface ICreatePhysicalActivityLevel {
  exampleEn: string;
  exampleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  activityValue: number | null;
  image: string;
  isActive: boolean;
}

export interface IUpdatePhysicalActivityLevel
  extends IBaseUpdateDto,
    ICreatePhysicalActivityLevel {
  imageUrl?: string;
}
export interface IPhysicalActivityLevelsListDto
  extends IBaseResponseListDto<IPhysicalActivityLevels> {}

export interface IPhysicalActivityLevelsDetailsDto
  extends IBaseResponseDetailsDto<IPhysicalActivityLevels> {}

import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";

export interface IMeasurmentUnitsListDto
  extends IBaseResponseListDto<IMeasurmentUnits> {}

export interface ICreateMeasurmentUnitsDto {
  nameAr: string;
  nameEn: string;
  code: string;
  icon: string | File;
}

export interface IUpdateMeasurmentUnitDto
  extends IBaseUpdateDto,
    ICreateMeasurmentUnitsDto {}

export interface IMeasurmentUnitsDetailsDto
  extends IBaseResponseDetailsDto<IMeasurmentUnits> {}

export interface IMeasurmentUnits extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  // icon: string | null;
  iconUrl: string | null;
  isActive: boolean;
}

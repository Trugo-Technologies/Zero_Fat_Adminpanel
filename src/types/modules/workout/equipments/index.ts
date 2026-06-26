import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { ICategories } from "../../nutriplan/categories";

export interface IEquipmentsListDto extends IBaseResponseListDto<IEquipment> {}

export interface ICreateEquipmentDto {
  nameAr: string;
  nameEn: string;
  categoryId: string;
  category?: ICategories | null;
  image: string;
  isActive: boolean;
}

export interface IUpdateEquipmentDto
  extends IBaseUpdateDto,
    ICreateEquipmentDto {
  imageUrl?: string;
}

export interface IEquipmentDetailsDto
  extends IBaseResponseDetailsDto<IEquipment> {}

export interface IEquipment extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  category: ICategories;
  categoryId: string;
  imageUrl: string;

  isActive: boolean;
}

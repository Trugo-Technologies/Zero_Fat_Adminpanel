/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IAdmin {
  id: string;
  publicId: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  imageUrl: string;
  email: string;
  isActive: boolean;
}

export interface IAdminListDto extends IBaseResponseListDto<IAdmin> {}

type FinalResponseForDetails = IAdmin & IBaseAdditionalResponseDetailsDto;
export interface IAdminDetailsDto
  extends IBaseResponseDetailsDto<FinalResponseForDetails> {}

export interface ICreateAdminDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber: string;
  image?: string;
  isActive: boolean;
}

export interface IResetAdminPasswordDto {
  userId: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IUpdateAdminDto
  extends IBaseUpdateDto,
    Omit<ICreateAdminDto, "password" | "confirmPassword"> {
  imageUrl: string;
}

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";

export interface IClientLocationsListDto
  extends IBaseResponseListDto<IClientLocations> {}

export interface ICreateClientLocation {
  clientId: string;
  longitude: number;
  latitude: number;
  fullAddressEn: string;
  fullAddressAr: string;
  area: string;
  building: string;
  block: string;
  street: string;
  flat: string;
  office: string;
  type: string;
  postalCode: string;
  notesFromClient: string;
  notesFromZeroFat: string;
}

export interface IUpdateClientLocation
  extends IBaseUpdateDto,
    ICreateClientLocation {}

export interface IClientLocationsDetails
  extends IBaseResponseDetailsDto<IClientLocations> {}

export interface IClientLocations extends IBaseAdditionalResponseDetailsDto {
  id: string;
  clientId: string;
  longitude: number;
  latitude: number;
  fullAddressEn: string;
  fullAddressAr: string;
  area: string;
  building: string;
  block: string;
  street: string;
  flat: string;
  office: string;
  type: string;
  postalCode: string;
  notesFromClient: string;
  notesFromZeroFat: string;
}

export interface IAddressDto {
  latitude: number;
  longitude: number;
}

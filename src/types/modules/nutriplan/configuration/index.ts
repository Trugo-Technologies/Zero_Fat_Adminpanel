import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";

export interface IConfigurationListDto
  extends Omit<IBaseResponseListDto<IConfiguration>, "data">,
    IConfiguration {}

export interface ICreateConfigurationDto {
  offsetSubscriptionInDays: number;
}

export interface IUpdateConfigurationDto
  extends IBaseUpdateDto,
    ICreateConfigurationDto {}

export interface IConfigurationDetailsDto
  extends IBaseResponseDetailsDto<IConfiguration> {}

export interface IConfiguration extends IBaseAdditionalResponseDetailsDto {
  data: {
    offsetSubscriptionInDays: number;
  };
}

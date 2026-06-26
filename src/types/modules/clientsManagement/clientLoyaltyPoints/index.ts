import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface IClientLoyaltyPointsListDto
  extends IBaseResponseListDto<IClientLoyaltyPoints> {}

export interface IClientLoyaltyPointsDetails
  extends IBaseResponseDetailsDto<IClientLoyaltyPoints> {}

export interface IClientLoyaltyPoints
  extends IBaseAdditionalResponseDetailsDto {
  id: string;
  points: number;
  dateEarned: string;
  expiryDate: string;
  type: string;
  reason: string;
  transactionId: string;
  source: string;
}

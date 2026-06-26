/** @format */

import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";
import { IClient } from "../clients";
import { IClientSubscriptions } from "../clientSubscriptions";

export interface IPaymentsListDto extends IBaseResponseListDto<IPayments> {}

export interface IPaymentsDetails extends IBaseResponseDetailsDto<IPayments> {}

export interface IPayments extends IBaseAdditionalResponseDetailsDto {
  id: string;

  client: IClient;

  paymentStatus: string;

  amount: number;
  currency: string;
  invoiceNumber: string;
  paymentGateway: string;
  paymentMethod: string;
  transactionId: number;
  paymentDate: string;

  // new
  reason: string;
  notes: string;
  clientId: string;
  clientSubscription: IClientSubscriptions;
}

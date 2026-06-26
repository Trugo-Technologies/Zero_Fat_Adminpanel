import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface ISubscriptionPlansListDto
  extends IBaseResponseListDto<ISubscriptionPlan> {}

export interface ISubscriptionPlansDetails
  extends IBaseResponseDetailsDto<ISubscriptionPlan> {}

export interface ISubscriptionPlan extends IBaseAdditionalResponseDetailsDto {
  id: string;
  titleEn: string;
  titleAr: string;
  subscriptionModule: string;
  subscriptionType: string;
  paymobId: string;
  minimumOrderValue: number;
  discountAmount: number;
  paymob: number;
  percentageDiscount: boolean;
  isActive: boolean;
}

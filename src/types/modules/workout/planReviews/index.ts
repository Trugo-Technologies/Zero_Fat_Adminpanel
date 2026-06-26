import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface IPlanReviewsListDto
  extends IBaseResponseListDto<IPlanReviews> {}

export interface IPlanReviews extends IBaseAdditionalResponseDetailsDto {
  effectivenessRate: number;
  easyToUseRate: number;
  enjoyabilityRate: number;
  totalRate: number;
  content: string;
}

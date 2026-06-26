import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";
import { IFaqCategories } from "../faqCategories";

export interface IFaqListDto extends IBaseResponseListDto<IFaq> {}

export interface ICreateFaq {
  question: string;
  answer: string;
  faqCategoryId: string;
  tags: Array<string>;
  isActive: boolean;
}
export interface IUpdateFaq extends IBaseUpdateDto, ICreateFaq {}

export interface IFaqDetails extends IBaseResponseDetailsDto<IFaq> {}

export interface IFaq extends IBaseAdditionalResponseDetailsDto {
  id: string;
  question: string;
  answer: string;
  faqCategoryId: string;
  faqCategory: IFaqCategories;
  tags: Array<string>;
  isActive: boolean;
}

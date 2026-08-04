/** @format */

import {
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface IMealRating {
  id: string;
  clientId: string;
  customerName: string;
  customerImageUrl: string | null;
  dailyMealSelectionId: string;
  mealId: string;
  dishName: string;
  rating: number;
  ratingLabel: string;
  improvementTags: string[];
  additionalComment: string | null;
  feedback: string | null;
  mealDate: string;
  submittedOn: string;
  adminReply: string | null;
  adminRepliedOn: string | null;
  canReply: boolean;
}

export interface IMealRatingsListDto extends IBaseResponseListDto<IMealRating> {}

export interface IMealRatingByDailyMeal {
  id: string;
  rating: number;
  ratingLabel: string;
  improvementTags: string[];
  comment: string | null;
  additionalComment: string | null;
  feedback: string | null;
  adminReply: string | null;
  adminRepliedOn: string | null;
}

export interface IMealRatingByDailyMealDetails
  extends IBaseResponseDetailsDto<IMealRatingByDailyMeal> {}

export interface IMealRatingsSearchPayload {
  keyword?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string[];
  rating?: number;
  clientId?: string;
  mealId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IMealRatingReplyPayload {
  id: string;
  reply: string;
}

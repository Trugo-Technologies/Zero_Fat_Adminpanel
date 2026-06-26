import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { ICategories } from "../../nutriplan/categories";
import { IWorkoutBodyPart } from "../../workout/workoutBodyParts";
import { ITrainer } from "../trainers";

export interface IExercisesListDto extends IBaseResponseListDto<IExercise> {}

export interface ICreateExerciseDto {
  nameAr: string;
  nameEn: string;

  instructionsAr: string;
  instructionsEn: string;
  type: string;
  avatarImage?: string;
  media?: string | null;
  gif: string;
  trainerId: string;
  bodyPartsIds: Array<string>;
  isActive: boolean;
}

export interface IUpdateExerciseDto extends IBaseUpdateDto, ICreateExerciseDto {
  avatarImageUrl?: string;
  mediaUrl?: string | null;
  gifUrl?: string;
}

export interface IExerciseDetailsDto
  extends IBaseResponseDetailsDto<IExercise> {}

export interface IExercise extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  instructionsAr: string;
  instructionsEn: string;
  type: string;
  avatarImageUrl: string;
  mediaUrl: string;
  gifUrl: string;
  trainerId: string;
  trainer: ITrainer;
  bodyPartIds: Array<string>;
  bodyParts: Array<IWorkoutBodyPart>;
  isActive: boolean;
}

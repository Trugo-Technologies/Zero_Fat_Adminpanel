import {
  IBaseAdditionalResponseDetailsDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseUpdateDto,
} from "src/types/baseEntity";
import { ITrainer } from "../../training/trainers";
import { IEquipment } from "../equipments";
import { IWorkoutBodyPart } from "../workoutBodyParts";
import { Item } from "../workoutExercises";

export interface IWorkoutsListDto extends IBaseResponseListDto<IWorkout> {}

export interface ICreateWorkoutDto {
  nameAr: string;
  nameEn: string;
  avatarImage: string;
  profileMedia?: any;
  overviewAr: string;
  overviewEn: string;
  durationInMins: number | null;
  caloriesBurned: number | null;
  setNamesEn: Array<string>;
  setNamesAr: Array<string>;

  level: string;
  format: string;

  trainerId: string;
  trainer: ITrainer | null;
  workoutTypeId: string;
  workoutType: IWorkout | null;

  equipmentIds: Array<string>;
  equipments: Array<IEquipment>;
  bodyPartsIds: Array<string>;
  bodyParts: Array<IWorkoutBodyPart>;
  exerciseSets?: Array<Item>;
  sets?: number | null;
  isActive: boolean;
}
export interface IUpdateWorkoutDto extends IBaseUpdateDto, ICreateWorkoutDto {
  profileMediaUrl?: string | null;
  avatarImageUrl?: string;
}

export interface IWorkoutDetailsDto extends IBaseResponseDetailsDto<IWorkout> {}

export interface IWorkout extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  avatarImageUrl: string;
  profileMediaUrl: string;
  overviewAr: string;
  overviewEn: string;
  durationInMins: number | null;
  level: string;
  format: string;
  workoutType: IWorkout | null;

  trainer: ITrainer;
  equipments: Array<IEquipment>;
  equipmentIds: Array<string>;
  bodyParts: Array<IWorkoutBodyPart>;
  bodyPartIds: Array<string>;
  caloriesBurned: number | null;
  setNamesEn: Array<string>;
  setNamesAr: Array<string>;
  isActive: boolean;
}

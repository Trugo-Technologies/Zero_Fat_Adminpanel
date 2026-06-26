import {
  IBaseUpdateDto,
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
  IBaseAdditionalResponseDetailsDto,
} from "src/types/baseEntity";
import { IPlanGoal } from "../planGoals";
import { IWorkout } from "../workouts";

export interface IPlanSchedulesListDto
  extends IBaseResponseListDto<IPlanSchedule> {}

export interface ICreatePlanScheduleDto {
  day: number;
  daytime: string | null;
  planId: string;
  workoutId: string;
}

export interface IUpdatePlanScheduleDto
  extends IBaseUpdateDto,
    ICreatePlanScheduleDto {
  plan?: IPlanGoal;
  workout?: IWorkout;
}

export interface IPlanScheduleDetailsDto
  extends IBaseResponseDetailsDto<IPlanSchedule> {}

export interface IPlanSchedule extends IBaseAdditionalResponseDetailsDto {
  id: string;
  day: number;
  daytime: string;
  plan: IPlanGoal;
  workout: IWorkout;
}

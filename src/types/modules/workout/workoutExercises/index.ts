import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';
import { IExercise } from '../../training/exercises';
import { IWorkout } from '../workouts';

export interface IWorkoutExercisesListDto extends IBaseResponseListDto<IWorkoutExercise> {}

export interface ICreateWorkoutExerciseDto {
  workoutId: string;
  items: Array<Item>;
  sets: number | null;
}

export interface IUpdateWorkoutExerciseDto extends IBaseUpdateDto, Item {}

export interface IWorkoutExerciseDetailsDto extends IBaseResponseDetailsDto<IWorkoutExercise> {}

export interface IWorkoutExercise extends IBaseAdditionalResponseDetailsDto, Item {
  id: string;
  workout: IWorkout;
  exercise: IExercise;
}

export interface Item {
  exerciseId: string;
  exercise?: IExercise | null;
  reps: number | null;
  sets: number | null;
  durationInSec: number | null;
  weight: number | null;
}

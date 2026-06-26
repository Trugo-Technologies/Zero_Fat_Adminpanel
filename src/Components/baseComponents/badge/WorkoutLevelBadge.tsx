import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { workoutLevel } from '../../../types/enums';
interface IWorkoutLevelBadgeProps {
  label: string;
}

const WorkoutLevelBadge: React.FC<IWorkoutLevelBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case workoutLevel.Beginner:
        return {
          color: '#646405',
        };
      case workoutLevel.Intermediate:
        return {
          color: '#a5d060',
        };
      case workoutLevel.Advanced:
        return {
          color: '#c91c1cbd',
        };
      default:
        return {
          color: 'blue',
        };
    }
  };

  return <AppBoxBadge label={`workouts.level.${label}`} backgroundColor={getCurrentColorBadge(label).color} />;
};

export default WorkoutLevelBadge;

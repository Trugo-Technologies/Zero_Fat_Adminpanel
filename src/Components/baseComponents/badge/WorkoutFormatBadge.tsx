import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { workoutFormat } from '../../../types/enums';
interface IWorkoutFormatBadgeProps {
  label: string;
}

const WorkoutFormatBadge: React.FC<IWorkoutFormatBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case workoutFormat.SetReps:
        return {
          color: '#209599',
        };
      case workoutFormat.FollowAlong:
        return {
          color: '#4d0c78',
        };

      default:
        return {
          color: '#000',
        };
    }
  };

  return <AppBoxBadge label={`workouts.format.${label}`} backgroundColor={getCurrentColorBadge(label).color} />;
};

export default WorkoutFormatBadge;

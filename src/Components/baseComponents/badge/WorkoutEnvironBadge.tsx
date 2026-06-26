import * as React from 'react';
import AppBoxBadge from 'src/Components/baseComponents/badge/AppBoxBadge';
import { workoutEnvironment } from '../../../types/enums';
interface IWorkoutEnvironBadgeProps {
  label: string;
}

const WorkoutEnvironBadge: React.FC<IWorkoutEnvironBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case workoutEnvironment.Gym:
        return {
          color: '#422099',
        };
      case workoutEnvironment.Home:
        return {
          color: '#53b3c1',
        };

      default:
        return {
          color: '#000',
        };
    }
  };

  return <AppBoxBadge label={`workouts.environment.${label}`} backgroundColor={getCurrentColorBadge(label).color} />;
};

export default WorkoutEnvironBadge;

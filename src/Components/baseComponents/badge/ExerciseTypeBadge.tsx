import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { exerciseType } from '../../../types/enums';
interface IExerciseTypeBadgeProps {
  label: string;
}

const ExerciseTypeBadge: React.FC<IExerciseTypeBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case exerciseType.Duration:
        return {
          color: '#2c7d6e',
        };
      case exerciseType.Reps:
        return {
          color: '#a5d060',
        };
      case exerciseType.WeightAndReps:
        return {
          color: '#193407c7',
        };
      default:
        return {
          color: 'blue',
        };
    }
  };

  return <AppBoxBadge label={`exercises.type.${label}`} backgroundColor={getCurrentColorBadge(label).color} />;
};

export default ExerciseTypeBadge;

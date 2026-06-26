import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import {
  mealPlansDefaultDietitianGoal,
  workoutLevel,
} from '../../../types/enums';
interface IMealPlanDefaultDietitianGoalProps {
  label: string;
}

const MealPlanDefaultDietitianGoal: React.FC<
  IMealPlanDefaultDietitianGoalProps
> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case mealPlansDefaultDietitianGoal.BuildMuscles:
        return {
          color: '#646405',
        };
      case mealPlansDefaultDietitianGoal.GainWeight:
        return {
          color: '#a5d060',
        };

      case mealPlansDefaultDietitianGoal.GeneralHealth:
        return {
          color: '#c91c1cbd',
        };
      case mealPlansDefaultDietitianGoal.LoseWeight:
        return {
          color: '#71714c',
        };
      case mealPlansDefaultDietitianGoal.LoseFat:
        return {
          color: '#4d9998',
        };
      default:
        return {
          color: '#000',
        };
    }
  };

  return (
    <AppBoxBadge
      label={`defaultDietitianGoal.type.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default MealPlanDefaultDietitianGoal;

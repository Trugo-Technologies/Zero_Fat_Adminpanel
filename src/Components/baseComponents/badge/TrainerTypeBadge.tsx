import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { trainerType } from '../../../types/enums';
interface ITrainerTypeBadgeProps {
  label: string;
}

const TrainerTypeBadge: React.FC<ITrainerTypeBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case trainerType.Athlete:
        return {
          color: '#2c7d6e',
        };
      case trainerType.Trainer:
        return {
          color: '#a5d060',
        };
      default:
        return {
          color: 'blue',
        };
    }
  };

  return <AppBoxBadge label={label} backgroundColor={getCurrentColorBadge(label).color} />;
};

export default TrainerTypeBadge;

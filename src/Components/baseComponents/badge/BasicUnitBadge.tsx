import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import {
  basicUnit,
  exerciseType,
  ingredientStatus,
} from '../../../types/enums';
interface IBasicUnitBadgeProps {
  label: string;
}

const BasicUnitBadge: React.FC<IBasicUnitBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case basicUnit.Liquid:
        return {
          color: '#2c7d6e',
        };
      case basicUnit.Solid:
        return {
          color: '#a5d060',
        };

      default:
        return {
          color: '#000',
        };
    }
  };

  return (
    <AppBoxBadge
      label={`ingredients.basicUnit.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default BasicUnitBadge;

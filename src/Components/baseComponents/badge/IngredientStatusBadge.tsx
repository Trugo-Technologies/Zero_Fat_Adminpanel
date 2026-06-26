import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { exerciseType, ingredientStatus } from '../../../types/enums';
interface IIngredientStatusBadgeProps {
  label: string;
}

const IngredientStatusBadge: React.FC<IIngredientStatusBadgeProps> = (
  props,
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case ingredientStatus.Available:
        return {
          color: '#2c7d6e',
        };
      case ingredientStatus.Discontinued:
        return {
          color: '#a5d060',
        };
      case ingredientStatus.OutOfStock:
        return {
          color: '#193407c7',
        };
      default:
        return {
          color: 'blue',
        };
    }
  };

  return (
    <AppBoxBadge
      label={`ingredients.status.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default IngredientStatusBadge;

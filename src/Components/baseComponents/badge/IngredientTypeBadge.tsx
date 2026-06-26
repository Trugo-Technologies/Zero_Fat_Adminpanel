import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { ingredientType } from '../../../types/enums';
interface IIngredientTypeBadgeProps {
  label: string;
}

const IngredientTypeBadge: React.FC<IIngredientTypeBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case ingredientType.Dairy:
        return {
          color: '#646405',
        };
      case ingredientType.Fruit:
        return {
          color: '#a5d060',
        };

      case ingredientType.Grain:
        return {
          color: '#c91c1cbd',
        };
      case ingredientType.Meat:
        return {
          color: '#71714c',
        };
      case ingredientType.Nut:
        return {
          color: '#4d9998',
        };
      case ingredientType.Spice:
        return {
          color: '#4d9998',
        };
      case ingredientType.Vegetable:
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
      label={`ingredients.type.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default IngredientTypeBadge;

import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { dietaryPreference } from '../../../types/enums';
interface IDietaryPreferenceBadgeProps {
  label: string;
}

const DietaryPreferenceBadge: React.FC<IDietaryPreferenceBadgeProps> = (
  props,
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case dietaryPreference.Keto:
        return {
          color: '#646405',
        };
      case dietaryPreference.NonVegetarian:
        return {
          color: '#a5d060',
        };

      case dietaryPreference.Paleo:
        return {
          color: '#c91c1cbd',
        };
      case dietaryPreference.Vegetarian:
        return {
          color: '#71714c',
        };
      case dietaryPreference.Vegan:
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
      label={`ingredients.dietaryPreference.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default DietaryPreferenceBadge;

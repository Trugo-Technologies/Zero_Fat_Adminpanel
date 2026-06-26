import * as React from 'react';
import AppBoxBadge from './AppBoxBadge';
import { categoryType } from '../../../types/enums';
interface ICategoryBadgeProps {
  label: string;
}

const CategoryBadge: React.FC<ICategoryBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case categoryType.Ingredient:
        return {
          color: '#422099',
        };
      case categoryType.Recipe:
        return {
          color: '#53b3c1',
        };

      default:
        return {
          color: '#000',
        };
    }
  };

  return (
    <AppBoxBadge
      label={`categories.categoryType.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default CategoryBadge;

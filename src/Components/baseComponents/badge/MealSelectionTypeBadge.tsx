/** @format */

import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
interface IProps {
  label: string;
}

const MealSelectionTypeBadge: React.FC<IProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case "Default":
        return {
          color: "#646405",
        };
      case "AddOn":
        return {
          color: "#4d9998",
        };

      case "Custom":
        return {
          color: "#71714c",
        };
      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`mealSelectionType.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default MealSelectionTypeBadge;

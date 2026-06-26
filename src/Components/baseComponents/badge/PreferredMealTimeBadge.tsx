/** @format */

import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { preferredMealTime, trainerType } from "../../../types/enums";
interface IPreferredMealTimeBadgeProps {
  label: string;
}

const PreferredMealTimeBadge: React.FC<IPreferredMealTimeBadgeProps> = (
  props
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case preferredMealTime.Evening:
        return {
          color: "#2c7d6e",
        };
      case preferredMealTime.Morning:
        return {
          color: "#a5d060",
        };
      default:
        return {
          color: "black",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`payments.preferredMealTime.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default PreferredMealTimeBadge;

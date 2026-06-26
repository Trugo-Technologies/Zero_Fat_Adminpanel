import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { dietitianGoal } from "../../../types/enums";
interface IDietitianGoalBadgeProps {
  label: string;
}

const DietitianGoalBadge: React.FC<IDietitianGoalBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case dietitianGoal.BuildMuscles:
        return {
          color: "#646405",
        };
      case dietitianGoal.GainWeight:
        return {
          color: "#a5d060",
        };

      case dietitianGoal.GeneralHealth:
        return {
          color: "#c91c1cbd",
        };
      case dietitianGoal.LoseFat:
        return {
          color: "#71714c",
        };
      case dietitianGoal.LoseWeight:
        return {
          color: "#4d9998",
        };

      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`clients.dietitianGoal.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default DietitianGoalBadge;

import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { gender } from "../../../types/enums";
interface IGenderBadgeProps {
  label: string;
}

const GenderBadge: React.FC<IGenderBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case gender.Male:
        return {
          color: "#2c7d6e",
        };
      case gender.Female:
        return {
          color: "#a5d060",
        };
      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`common.gender.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default GenderBadge;

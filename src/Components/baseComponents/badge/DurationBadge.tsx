/** @format */

import * as React from "react";
import { Duration } from "src/types/modules/clientsManagement/discounts/discountRules";
import AppBoxBadge from "./AppBoxBadge";
interface IProps {
  label: string;
}

const DurationBadge: React.FC<IProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case Duration.Forever:
        return {
          color: "#2c7d6e",
        };
      case Duration.Once:
        return {
          color: "#a5d060",
        };
      case Duration.Repeating:
        return {
          color: "#000",
        };

      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`discountRules.duration.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default DurationBadge;

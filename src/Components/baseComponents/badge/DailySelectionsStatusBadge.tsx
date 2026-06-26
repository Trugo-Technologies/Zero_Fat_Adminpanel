/** @format */

import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import {
  dailySelectionsStatus,
  dietitianGoal,
  paymentStatus,
} from "../../../types/enums";
interface IDailySelectionsStatusBadgeProps {
  label: string;
}

const DailySelectionsStatusBadge: React.FC<IDailySelectionsStatusBadgeProps> = (
  props
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case dailySelectionsStatus.Pending:
        return {
          color: "#646405",
        };
      case dailySelectionsStatus.Delivered:
        return {
          color: "#a5d060",
        };

      case dailySelectionsStatus.Cancelled:
        return {
          color: "#c91c1cbd",
        };
      case dailySelectionsStatus.Initialized:
        return {
          color: "#71714c",
        };
      case dailySelectionsStatus.Confirmed:
        return {
          color: "#4d9998",
        };
      case dailySelectionsStatus.Preparing:
        return {
          color: "purple",
        };
      case dailySelectionsStatus.OutForDelivery:
        return {
          color: "blue",
        };
      case dailySelectionsStatus.Paused:
        return {
          color: "green",
        };

      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`dailySelections.dailySelectionStatus.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default DailySelectionsStatusBadge;

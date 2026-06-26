import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { subscriptionStatus, workoutLevel } from "../../../types/enums";
interface ISubscriptionBadgeProps {
  label: string;
}

const SubscriptionBadge: React.FC<ISubscriptionBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case subscriptionStatus.Active:
        return {
          color: "#646405",
        };
      case subscriptionStatus.Pending:
        return {
          color: "#a5d060",
        };
      case subscriptionStatus.Cancelled:
        return {
          color: "#c91c1cbd",
        };
      default:
        return {
          color: "blue",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`clients.subscriptionStatus.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default SubscriptionBadge;

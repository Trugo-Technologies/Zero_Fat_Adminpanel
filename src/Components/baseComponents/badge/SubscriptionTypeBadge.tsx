import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { subscriptionType } from "../../../types/enums";
interface ISubscriptionTypeBadgeProps {
  label: string;
}

const SubscriptionTypeBadge: React.FC<ISubscriptionTypeBadgeProps> = (
  props
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case subscriptionType.OneWeek:
        return {
          color: "#646405",
        };
      case subscriptionType.OneMonth:
        return {
          color: "#a5d060",
        };
      case subscriptionType.ThreeMonths:
        return {
          color: "#c91c1cbd",
        };
      default:
        return {
          color: "#000",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`subscriptionPlans.subscriptionType.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default SubscriptionTypeBadge;

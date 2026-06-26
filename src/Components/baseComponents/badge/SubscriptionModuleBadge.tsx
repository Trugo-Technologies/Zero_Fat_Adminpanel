import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { subscriptionPlans } from "../../../types/enums";
interface ISubscriptionModuleBadgeProps {
  label: string;
}

const SubscriptionModuleBadge: React.FC<ISubscriptionModuleBadgeProps> = (
  props
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case subscriptionPlans.NutriPlan:
        return {
          color: "#646405",
        };
      case subscriptionPlans.Workout:
        return {
          color: "#a5d060",
        };

      case subscriptionPlans.UsersModule:
        return {
          color: "#c91c1cbd",
        };
      case subscriptionPlans.ClientPortal:
        return {
          color: "#71714c",
        };
      case subscriptionPlans.AuditingModule:
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
      label={`subscriptionPlans.subscriptionModule.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default SubscriptionModuleBadge;

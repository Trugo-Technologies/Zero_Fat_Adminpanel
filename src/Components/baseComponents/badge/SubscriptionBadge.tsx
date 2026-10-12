import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { subscriptionStatus } from "../../../types/enums";

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
      case "Canceled":
        return {
          color: "#c91c1cbd",
        };
      case subscriptionStatus.Expired:
      case "PastDue":
        return {
          color: "#c91c1cbd",
        };
      case subscriptionStatus.NoSubscription:
        return {
          color: "#64748B",
        };
      default:
        return {
          color: "blue",
        };
    }
  };

  return (
    <AppBoxBadge
      label={label}
      translate={false}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default SubscriptionBadge;

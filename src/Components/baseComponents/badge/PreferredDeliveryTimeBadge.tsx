/** @format */

import * as React from "react";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import AppBoxBadge from "./AppBoxBadge";
interface ISubscriptionTypeBadgeProps {
  label: string;
}

const PreferredDeliveryTimeBadge: React.FC<ISubscriptionTypeBadgeProps> = (
  props
) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case PreferredDeliveryTime.EarlyMorning:
        return {
          color: "blue",
        };
      case PreferredDeliveryTime.Evening:
        return {
          color: "red",
        };
      case PreferredDeliveryTime.Morning:
        return {
          color: "black",
        };
      default:
        return {
          color: "green",
        };
    }
  };

  return (
    <AppBoxBadge
      label={`preferredDeliveryTime.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default PreferredDeliveryTimeBadge;

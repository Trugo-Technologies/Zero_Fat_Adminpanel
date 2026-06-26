import * as React from "react";
import AppBoxBadge from "./AppBoxBadge";
import { dietitianGoal, paymentStatus } from "../../../types/enums";
interface IPaymentStatusBadgeProps {
  label: string;
}

const PaymentStatusBadge: React.FC<IPaymentStatusBadgeProps> = (props) => {
  const { label } = props;
  const getCurrentColorBadge = (type: string) => {
    switch (type) {
      case paymentStatus.PartiallyPaid:
        return {
          color: "#646405",
        };
      case paymentStatus.Paid:
        return {
          color: "#a5d060",
        };

      case paymentStatus.PartiallyPaid:
        return {
          color: "#c91c1cbd",
        };
      case paymentStatus.Pending:
        return {
          color: "#71714c",
        };
      case paymentStatus.Refunded:
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
      label={`payments.paymentStatus.${label}`}
      backgroundColor={getCurrentColorBadge(label).color}
    />
  );
};

export default PaymentStatusBadge;

/** @format */

import { IDeliveryCalendarActionPreview } from "src/types/modules/clientsManagement/clientAccountAccess";

export const getDeliveryPreviewTotal = (
  preview?: IDeliveryCalendarActionPreview | null
) => {
  if (!preview) return null;

  const value =
    preview.proratedChargeAmount ??
    preview.totalPrice ??
    preview.grandTotal ??
    preview.totalAmount ??
    preview.total ??
    preview.amountDue ??
    preview.subtotal ??
    preview.newPlanTotal;

  return typeof value === "number" ? value : null;
};

export const getDeliveryPreviewLines = (
  preview?: IDeliveryCalendarActionPreview | null
) => preview?.lines ?? preview?.items ?? [];

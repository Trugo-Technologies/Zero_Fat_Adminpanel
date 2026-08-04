import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { IDeliveryCalendarActionPreview } from "src/types/modules/clientsManagement/clientAccountAccess";
import {
  getDeliveryPreviewLines,
  getDeliveryPreviewTotal,
} from "../getDeliveryPreviewTotal";

type Props = {
  preview: IDeliveryCalendarActionPreview | null;
  fallbackTotal?: number | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const formatAmount = (value?: number | null) => {
  if (typeof value !== "number") return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}AED ${value.toFixed(2)}`;
};

const formatAbsoluteAmount = (value?: number | null) => {
  if (typeof value !== "number") return "—";
  return `AED ${value.toFixed(2)}`;
};

const DeliveryActionPreviewPanel = ({
  preview,
  fallbackTotal = null,
  isLoading = false,
  errorMessage = null,
}: Props) => {
  const isChangeMealPlanPreview =
    preview != null &&
    (typeof preview.currentPlanTotal === "number" ||
      typeof preview.newPlanTotal === "number" ||
      typeof preview.periodDifference === "number" ||
      typeof preview.proratedChargeAmount === "number" ||
      typeof preview.chargedDays === "number" ||
      typeof preview.oneDayProratedAmount === "number");

  const total = getDeliveryPreviewTotal(preview) ?? fallbackTotal;
  const lines = getDeliveryPreviewLines(preview);
  const requiresPayment =
    preview?.requiresPayment ?? preview?.paymentRequired ?? false;

  if (isLoading && !preview) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #E2E8F0",
          bgcolor: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 2,
        }}
      >
        <CircularProgress size={20} />
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          Calculating preview...
        </Typography>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #FECACA",
          bgcolor: "#FEF2F2",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: 13, color: "#B91C1C", fontWeight: 600 }}>
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  if (!preview) return null;

  if (isChangeMealPlanPreview) {
    const difference = preview.periodDifference ?? 0;
    const isIncrease = difference > 0;
    const isDecrease = difference < 0;

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #E2E8F0",
          bgcolor: "#F8FAFC",
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
            Price Summary
          </Typography>
          {isLoading ? <CircularProgress size={18} /> : null}
        </Stack>

        {preview.date ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
            Effective from{" "}
            <Typography component="span" sx={{ fontWeight: 700, color: "#0F172A" }}>
              {dayjs(preview.date).format("MMM D, YYYY")}
            </Typography>
          </Typography>
        ) : null}

        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Current plan cost
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                Full subscription period
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {formatAbsoluteAmount(preview.currentPlanTotal)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                New plan cost
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                Full subscription period
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {formatAbsoluteAmount(preview.newPlanTotal)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {isIncrease
                ? "Additional cost"
                : isDecrease
                  ? "Savings"
                  : "No price change"}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: isDecrease ? "#059669" : isIncrease ? "#DC2626" : "#0F172A",
              }}
            >
              {isDecrease
                ? formatAbsoluteAmount(Math.abs(difference))
                : formatAmount(preview.periodDifference)}
            </Typography>
          </Stack>

          {typeof preview.chargedDays === "number" ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Days charged
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {preview.chargedDays} day{preview.chargedDays === 1 ? "" : "s"}
              </Typography>
            </Stack>
          ) : null}

          {typeof preview.oneDayProratedAmount === "number" ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Daily rate
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {formatAbsoluteAmount(preview.oneDayProratedAmount)} / day
              </Typography>
            </Stack>
          ) : null}

          <Divider sx={{ my: 0.5 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {requiresPayment ? "Amount due now" : "Amount due"}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                Prorated for remaining days
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: requiresPayment ? "#DC2626" : "#059669",
              }}
            >
              {formatAbsoluteAmount(preview.proratedChargeAmount)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            label={requiresPayment ? "Payment required" : "No payment required"}
            color={requiresPayment ? "warning" : "success"}
            sx={{ fontWeight: 600 }}
          />
          {typeof preview.applyStartingFromThisDay === "boolean" ? (
            <Chip
              size="small"
              variant="outlined"
              label={
                preview.applyStartingFromThisDay
                  ? "Applies from this day onward"
                  : "Applies to this day only"
              }
              sx={{ fontWeight: 600 }}
            />
          ) : null}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        mb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 500 }}>
          Total Price
        </Typography>
        {isLoading ? <CircularProgress size={18} color="inherit" /> : null}
      </Stack>

      <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
        {total !== null ? `AED ${total.toFixed(2)}` : "—"}
      </Typography>

      {requiresPayment ? (
        <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.9 }}>
          Payment required
        </Typography>
      ) : null}

      {lines.length > 0 ? (
        <Stack spacing={0.5} sx={{ mt: 1.5 }}>
          {lines.map((line, index) => {
            const lineTotal = line.lineTotal ?? line.amount;
            const quantity = line.quantity ?? 1;
            const unitPrice = line.unitPrice;
            const label =
              line.mealName || line.nameEn || line.nameAr || line.name || "Item";
            const lineKey = line.mealId ?? `${label}-${index}`;

            return (
              <Typography key={lineKey} variant="caption" sx={{ opacity: 0.9 }}>
                {label}
                {unitPrice !== undefined
                  ? ` — AED ${unitPrice.toFixed(2)} x ${quantity}`
                  : ""}
                {lineTotal !== undefined ? ` = AED ${lineTotal.toFixed(2)}` : ""}
              </Typography>
            );
          })}
        </Stack>
      ) : null}
    </Box>
  );
};

export default DeliveryActionPreviewPanel;

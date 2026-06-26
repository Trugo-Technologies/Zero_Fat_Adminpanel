import { Box, Typography, Chip, Stack, Divider, Avatar, Button } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

type Props = {
  customerName: string;
  customerId: string;
  planName: string;
  calories: string;
  proteinTarget: number;
  mealsPerDay: number;
  duration: string;
  deliveryDays: string;
  additionalItemsCost: number;
  discountAmount: number;
  subtotal: number;
  vat: number;
  total: number;
};

const SummaryPanel = (props: Props) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "sticky", top: 24, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
      {/* Customer Info */}
      <Box sx={{ p: 3, borderBottom: "1px solid #F1F5F9" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", fontSize: 16, fontWeight: 700 }}>
            {props.customerName.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{props.customerName}</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>{props.customerId}</Typography>
          </Box>
          <Chip label="Active" size="small" sx={{ ml: "auto", bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", fontWeight: 700, borderRadius: 1.5 }} />
        </Stack>
      </Box>

      {/* Subscription Summary */}
      <Box sx={{ p: 3, borderBottom: "1px solid #F1F5F9" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0F172A", mb: 2 }}>Subscription Summary</Typography>
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Meal Plan</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.planName || "—"}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Calories</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.calories || "—"}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Protein Target</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.proteinTarget}g</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Meals Per Day</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.mealsPerDay}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Duration</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.duration}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Delivery Days</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.deliveryDays}</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Pricing Breakdown */}
      <Box sx={{ p: 3, bgcolor: "#F8FAFC" }}>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>Subtotal</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.subtotal.toFixed(2)} AED</Typography>
          </Box>
          {props.additionalItemsCost > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>Additional Items</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.additionalItemsCost.toFixed(2)} AED</Typography>
            </Box>
          )}
          {props.discountAmount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 14, color: "success.main", fontWeight: 600 }}>Discounts</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "success.main" }}>- {props.discountAmount.toFixed(2)} AED</Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>VAT (5%)</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{props.vat.toFixed(2)} AED</Typography>
          </Box>
          <Divider sx={{ my: 1, borderColor: "#E2E8F0" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Total</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "primary.main" }}>{props.total.toFixed(2)} AED</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default SummaryPanel;

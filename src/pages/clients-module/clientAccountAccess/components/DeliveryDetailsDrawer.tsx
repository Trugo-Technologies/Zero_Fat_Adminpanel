/** @format */

import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EventIcon from "@mui/icons-material/Event";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import { alpha, Box, Button, Drawer, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { DeliveryDay } from "../types";
import { DeliveryStatusChip } from "./statusChip";

type Props = {
  open: boolean;
  delivery: DeliveryDay | null;
  onClose: () => void;
  onChangeMethod: () => void;
  onCancelDelivery: () => void;
  onMoveDelivery: () => void;
  onReplaceMeals: () => void;
  onAddItems: () => void;
  onChangeMealPlan: () => void;
};

const MealCard = ({
  icon,
  iconColor,
  iconBg,
  title,
  meal,
  imageSrc,
}: {
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  title: ReactNode;
  meal: string;
  imageSrc: string;
}) => {
  if (!meal || meal === "-") return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          objectFit: "cover",
          mr: 2,
        }}
      />
      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", mb: 0.25 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1A2B48" }}>{meal}</Typography>
      </Box>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

const ActionButton = ({ icon, color, label, onClick, isRed = false }: any) => (
  <Button
    fullWidth
    onClick={onClick}
    sx={{
      justifyContent: "flex-start",
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      bgcolor: "#FFFFFF",
      color: isRed ? "#EF4444" : "#1A2B48",
      textTransform: "none",
      fontWeight: 600,
      fontSize: 13,
      "&:hover": { bgcolor: alpha(color, 0.04), borderColor: color },
      "& .MuiButton-startIcon": {
        color: color,
        mr: 1.5,
      },
    }}
    startIcon={icon}
  >
    {label}
  </Button>
);

const DeliveryDetailsDrawer = ({
  open,
  delivery,
  onClose,
  onChangeMethod,
  onCancelDelivery,
  onMoveDelivery,
  onReplaceMeals,
  onAddItems,
  onChangeMealPlan,
}: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();
  const isPast = delivery && dayjs(delivery.date).isBefore(dayjs().startOf("day"));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          bgcolor: "#FFFFFF",
          color: "#1A2B48",
          p: 0,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(26, 43, 72, 0.4)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 0, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {delivery && (
        <>
          <Box sx={{ p: 4, pt: 1, flex: 1, overflowY: "auto" }}>
            {/* Top Header Card */}
            <Box
              sx={{
                p: 3,
                borderRadius: "20px",
                border: "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 1.5 }}>
                  {dayjs(delivery.date).format("dddd, MMM D, YYYY")}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <DeliveryStatusChip status={delivery.status} />
                </Box>
                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
                  {delivery.status === "Moved" && delivery.movedToDate 
                    ? `Moved to ${dayjs(delivery.movedToDate).format("MMM D, YYYY")}`
                    : delivery.status === "Delivered"
                      ? "Delivered on time"
                      : "Scheduled"}
                </Typography>
              </Box>
            </Box>

            {/* Delivery Details */}
            <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>
              <IntlMessages id="clientAccountAccess.deliveryDetails" />
            </Typography>
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalShippingOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
                    <IntlMessages id="clientAccountAccess.deliveryMethod" />
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                  {delivery.deliveryMethod}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ReceiptOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography sx={{ fontSize: 14, color: "text.secondary", fontWeight: 500 }}>
                    <IntlMessages id="clientAccountAccess.mealPlan" />
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{delivery.mealPlan}</Typography>
              </Stack>
            </Stack>

            {/* Meals */}
            <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>Meals (4)</Typography>
            <Stack spacing={2} sx={{ mb: 5 }}>
              <MealCard
                title={<IntlMessages id="clientAccountAccess.breakfast" />}
                meal={delivery.breakfast}
                imageSrc="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120"
                icon={<WbSunnyOutlinedIcon fontSize="small" />}
                iconColor="#F59E0B"
                iconBg={alpha("#F59E0B", 0.1)}
              />
              <MealCard
                title={<IntlMessages id="clientAccountAccess.lunch" />}
                meal={delivery.lunch}
                imageSrc="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120"
                icon={<WbSunnyOutlinedIcon fontSize="small" />}
                iconColor="#F59E0B"
                iconBg={alpha("#F59E0B", 0.1)}
              />
              <MealCard
                title={<IntlMessages id="clientAccountAccess.dinner" />}
                meal={delivery.dinner}
                imageSrc="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120"
                icon={<DarkModeOutlinedIcon fontSize="small" />}
                iconColor="#8B5CF6"
                iconBg={alpha("#8B5CF6", 0.1)}
              />
              <MealCard
                title={<IntlMessages id="clientAccountAccess.postWorkout" />}
                meal={delivery.postWorkout}
                imageSrc="https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=120"
                icon={<FitnessCenterOutlinedIcon fontSize="small" />}
                iconColor="#3B82F6"
                iconBg={alpha("#3B82F6", 0.1)}
              />
            </Stack>

            {/* Actions */}
            <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 2 }}>
              <IntlMessages id="clientAccountAccess.actions" />
            </Typography>
            
            {isPast ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor: alpha("#EF4444", 0.05),
                  border: "1px solid",
                  borderColor: alpha("#EF4444", 0.1),
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <BlockIcon sx={{ color: "#EF4444", fontSize: 20 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#EF4444" }}>
                  Actions cannot be performed on past deliveries.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<PaymentIcon />}
                    color={theme.palette.primary.main}
                    label="Payment Method"
                    onClick={onChangeMethod}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<BlockIcon />}
                    color="#EF4444"
                    label={messages["clientAccountAccess.cancelDelivery"] as string}
                    onClick={onCancelDelivery}
                    isRed
                  />
                </Grid>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<EventIcon />}
                    color={theme.palette.primary.main}
                    label={messages["clientAccountAccess.moveDelivery"] as string}
                    onClick={onMoveDelivery}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<SwapHorizIcon />}
                    color={theme.palette.primary.main}
                    label={messages["clientAccountAccess.replaceMeals"] as string}
                    onClick={onReplaceMeals}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<ShoppingBagOutlinedIcon />}
                    color={theme.palette.primary.main}
                    label={messages["clientAccountAccess.addAdditionalItems"] as string}
                    onClick={onAddItems}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ActionButton
                    icon={<RestaurantOutlinedIcon />}
                    color={theme.palette.primary.main}
                    label={messages["clientAccountAccess.changeMealPlan"] as string}
                    onClick={onChangeMealPlan}
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: 3, borderTop: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "12px",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
              <Typography sx={{ color: "text.secondary", fontSize: 13, mr: 0.5 }}>
                Cut-off time for changes:
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: 13, fontWeight: 700 }}>
                48 Hours Before
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default DeliveryDetailsDrawer;

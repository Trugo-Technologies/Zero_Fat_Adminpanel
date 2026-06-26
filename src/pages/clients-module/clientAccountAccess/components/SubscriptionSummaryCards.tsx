/** @format */

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { ClientAccountData } from "../types";

type Props = {
  client: ClientAccountData;
};

const summaryConfig = [
  {
    key: "activeMealPlan",
    icon: <RestaurantMenuIcon />,
    color: "#a5d060",
    getValue: (c: ClientAccountData) => c.activeMealPlan,
  },
  {
    key: "calories",
    icon: <LocalFireDepartmentIcon />,
    color: "#F04F47",
    getValue: (c: ClientAccountData) => `${c.calories} kcal`,
  },
  {
    key: "mealsPerDay",
    icon: <LocalDiningIcon />,
    color: "#11C15B",
    getValue: (c: ClientAccountData) => String(c.mealsPerDay),
  },
  {
    key: "remainingDays",
    icon: <CalendarMonthIcon />,
    color: "#6366F1",
    getValue: (c: ClientAccountData) => String(c.remainingDays),
  },
  {
    key: "totalDelivered",
    icon: <ShoppingBagIcon />,
    color: "#0EA5E9",
    getValue: (c: ClientAccountData) => String(c.totalDeliveredMeals),
  },
  {
    key: "upcomingDeliveries",
    icon: <TrendingUpIcon />,
    color: "#F59E0B",
    getValue: (c: ClientAccountData) => String(c.upcomingDeliveries),
  },
] as const;

const SubscriptionSummaryCards = ({ client }: Props) => {
  const { messages } = useIntl();

  const labelKeys: Record<string, string> = {
    activeMealPlan: "clientAccountAccess.summary.activeMealPlan",
    calories: "clientAccountAccess.summary.calories",
    mealsPerDay: "clientAccountAccess.summary.mealsPerDay",
    remainingDays: "clientAccountAccess.summary.remainingDays",
    totalDelivered: "clientAccountAccess.summary.totalDelivered",
    upcomingDeliveries: "clientAccountAccess.summary.upcomingDeliveries",
  };

  return (
    <Grid container spacing={2}>
      {summaryConfig.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.key}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              border: (t) => `1px solid ${t.palette.divider}`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${item.color}18`,
                color: item.color,
              }}
            >
              {item.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                noWrap
                title={item.getValue(client)}
              >
                {item.getValue(client)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {messages[labelKeys[item.key]] as string}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SubscriptionSummaryCards;

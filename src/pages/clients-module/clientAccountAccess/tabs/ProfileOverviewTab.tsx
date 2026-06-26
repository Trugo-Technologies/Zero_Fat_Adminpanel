/** @format */

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import {
  alpha,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useRef } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import DietitianGoalBadge from "src/Components/baseComponents/badge/DietitianGoalBadge";
import GenderBadge from "src/Components/baseComponents/badge/GenderBadge";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import AccessControlCard from "../components/AccessControlCard";
import DataField from "../components/profile/DataField";
import KpiStatCard from "../components/profile/KpiStatCard";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import WeightProgress from "../components/profile/WeightProgress";
import { ClientAccountData } from "../types";

type Props = {
  client: ClientAccountData;
  onBlock: (type: "oneDay" | "custom" | "permanent", expiry?: Dayjs) => void;
  onUnblock: () => void;
  onEdit: () => void;
  onSendNotification: () => void;
};

const allergenColors = ["#E57373", "#64B5F6", "#FFB74D", "#81C784", "#BA68C8"];

const ProfileOverviewTab = ({
  client,
  onBlock,
  onUnblock,
  onEdit,
  onSendNotification,
}: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { messages } = useIntl();
  const accessRef = useRef<HTMLDivElement>(null);

  const goalProgress = Math.min(
    100,
    Math.max(5, 100 - (client.timeToReachGoalInDays / 120) * 100)
  );

  const metricsGrid = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
    columnGap: 2,
    rowGap: 0,
  };

  return (
    <Stack spacing={2.5}>
      <ProfileHero
        client={client}
        onEdit={onEdit}
        onSendNotification={onSendNotification}
      />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <KpiStatCard
            label={messages["clientAccountAccess.summary.remainingDays"] as string}
            value={client.remainingDays}
            suffix="d"
            icon={<CalendarMonthOutlinedIcon />}
            accent={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiStatCard
            label={messages["clientAccountAccess.summary.totalDelivered"] as string}
            value={client.totalDeliveredMeals}
            icon={<RestaurantOutlinedIcon />}
            accent={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiStatCard
            label={messages["clientAccountAccess.summary.calories"] as string}
            value={client.calories}
            suffix="kcal"
            icon={<LocalFireDepartmentOutlinedIcon />}
            accent={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiStatCard
            label={messages["clinets.bmi"] as string}
            value={client.bmi}
            icon={<MonitorWeightOutlinedIcon />}
            accent={
              client.bmi > 25 ? theme.palette.error.main : theme.palette.success.main
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={3}>
            <ProfileInfoCard icon={<BadgeOutlinedIcon />} title={<IntlMessages id="clientAccountAccess.sections.contact" />}>
              <DataField label={<IntlMessages id="clientAccountAccess.email" />} value={client.email} />
              <DataField label={<IntlMessages id="clientAccountAccess.phone" />} value={client.phone} />
              <DataField label={<IntlMessages id="common.gender" />} value={<Box sx={{ display: "inline-flex" }}><GenderBadge label={client.gender} /></Box>} />
              <DataField label={<IntlMessages id="common.birthDate" />} value={dayjs(client.birthDate).format("MMM D, YYYY")} />
              <DataField label={<IntlMessages id="clientAccountAccess.customerId" />} value={client.customerId} />
              <DataField label={<IntlMessages id="clientAccountAccess.deliveryAddress" />} value={client.deliveryAddress} />
            </ProfileInfoCard>

            <ProfileInfoCard icon={<RestaurantOutlinedIcon />} title={<IntlMessages id="sidebar.allergens" />}>
              <Box sx={{ p: 2.5 }}>
                {client.clientAllergics.length > 0 ? (
                  <Stack direction="row" flexWrap="wrap" gap={1.5}>
                    {client.clientAllergics.map((a, i) => (
                      <Chip
                        key={a.nameEn}
                        label={getValueBasedOnCurrentLanguage(a.nameAr, a.nameEn)}
                        sx={{
                          fontWeight: 700,
                          fontSize: 13,
                          height: 34,
                          borderRadius: "10px",
                          background: `linear-gradient(135deg, ${alpha(allergenColors[i % allergenColors.length], 0.15)}, ${alpha(allergenColors[i % allergenColors.length], 0.05)})`,
                          color: allergenColors[i % allergenColors.length],
                          border: `1px solid ${alpha(allergenColors[i % allergenColors.length], 0.4)}`,
                          boxShadow: `0 2px 8px ${alpha(allergenColors[i % allergenColors.length], 0.1)}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 12px ${alpha(allergenColors[i % allergenColors.length], 0.2)}`,
                            background: `linear-gradient(135deg, ${alpha(allergenColors[i % allergenColors.length], 0.2)}, ${alpha(allergenColors[i % allergenColors.length], 0.1)})`,
                          }
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    <IntlMessages id="clientAccountAccess.noAllergens" />
                  </Typography>
                )}
              </Box>
            </ProfileInfoCard>

            <ProfileInfoCard icon={<LocalFireDepartmentOutlinedIcon />} title={<IntlMessages id="clientAccountAccess.sections.health" />}>
              <DataField label={<IntlMessages id="clinets.heightInCM" />} value={`${client.heightInCM} cm`} />
              <DataField label={<IntlMessages id="clinets.weightInKG" />} value={`${client.weightInKG} kg`} />
              <DataField label={<IntlMessages id="clinets.targetWeightInKG" />} value={`${client.targetWeightInKG} kg`} />
              <DataField label={<IntlMessages id="clinets.bmi" />} value={client.bmi} />
              <DataField label={<IntlMessages id="dailyMenuMeals.fat" />} value={`${client.bodyFat}%`} />
              <DataField label={<IntlMessages id="clinets.bmr" />} value={`${client.bmr} kcal`} />
              <DataField label={<IntlMessages id="clinets.tdee" />} value={`${client.tdee} kcal`} />
              <DataField label={<IntlMessages id="physicalActivityLevels.activityValue" />} value={client.activityValue} />
              
              <Box sx={{ mt: 2 }}>
                <WeightProgress current={client.weightInKG} target={client.targetWeightInKG} />
              </Box>
            </ProfileInfoCard>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={3}>
            <ProfileInfoCard 
              icon={<RestaurantMenuOutlinedIcon />} 
              title={<IntlMessages id="clientAccountAccess.sections.subscription" />}
              action={
                <Chip
                  label={client.subscriptionStatus}
                  size="small"
                  sx={{
                    bgcolor: client.subscriptionStatus === "Active" ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                    color: client.subscriptionStatus === "Active" ? "success.main" : "error.main",
                    fontWeight: 700,
                    borderRadius: 1.5,
                  }}
                />
              }
            >
              <DataField label={<IntlMessages id="clientAccountAccess.summary.activeMealPlan" />} value={<Typography sx={{ fontWeight: 800, fontSize: 16, color: "primary.main" }}>{client.activeMealPlan}</Typography>} />
              <DataField label={<IntlMessages id="clientAccountAccess.summary.calories" />} value={`${client.calories} kcal`} />
              <DataField label={<IntlMessages id="clientAccountAccess.summary.mealsPerDay" />} value={client.mealsPerDay} />
              <DataField label={<IntlMessages id="clientAccountAccess.subscriptionStart" />} value={dayjs(client.subscriptionStartDate).format("MMM D, YYYY")} />
              <DataField label={<IntlMessages id="clientAccountAccess.subscriptionEnd" />} value={dayjs(client.subscriptionEndDate).format("MMM D, YYYY")} />
              <DataField label={<IntlMessages id="clientAccountAccess.summary.remainingDays" />} value={client.remainingDays} />
              <DataField label={<IntlMessages id="clientAccountAccess.summary.totalDelivered" />} value={client.totalDeliveredMeals} />
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="medium" 
                  onClick={() => navigate("/clientsManagement/createSubscription")}
                  sx={{ borderRadius: 2, fontWeight: 700, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
                >
                  {client.subscriptionStatus === "Active" ? "Manage Subscription" : "Renew Subscription"}
                </Button>
              </Box>
            </ProfileInfoCard>

            <ProfileInfoCard icon={<EventAvailableOutlinedIcon />} title={<IntlMessages id="clientAccountAccess.sections.goals" />}>
              <DataField label={<IntlMessages id="clinets.dietitianGoal" />} value={<DietitianGoalBadge label={client.dietitianGoal} />} />
              <DataField label={<IntlMessages id="clinets.neededCaloriesToReachGoal" />} value={`${client.neededCaloriesToReachGoal} kcal`} />
              <DataField label={<IntlMessages id="clientAccountAccess.dailyCalories" />} value={`${client.calories} kcal`} />
              <DataField label={<IntlMessages id="clinets.timeToReachGoalInDays" />} value={client.timeToReachGoalInDays} />

              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(
                      theme.palette.primary.main,
                      0.08
                    )})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `inset 0 2px 4px ${alpha(theme.palette.common.white, 0.4)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary" }}>
                      <IntlMessages id="clientAccountAccess.goalTimeline" />
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                      {client.timeToReachGoalInDays}{" "}
                      {messages["clientAccountAccess.daysLabel"] as string}
                    </Typography>
                  </Stack>
                  <Box sx={{ position: "relative", mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={goalProgress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        "& .MuiLinearProgress-bar": { 
                          borderRadius: 5,
                          background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -4,
                        bottom: -4,
                        left: `${goalProgress}%`,
                        width: 4,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1.5, fontWeight: 600 }}>
                    <IntlMessages id="clientAccountAccess.estimatedGoalDate" />:{" "}
                    <strong style={{ color: theme.palette.text.primary, fontWeight: 800 }}>
                      {dayjs().add(client.timeToReachGoalInDays, "day").format("MMMM D, YYYY")}
                    </strong>
                  </Typography>
                </Box>
              </Box>
            </ProfileInfoCard>

            <Box ref={accessRef} sx={{ pt: 2 }}>
              <AccessControlCard client={client} onUnblock={onUnblock} onBlock={onBlock} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProfileOverviewTab;

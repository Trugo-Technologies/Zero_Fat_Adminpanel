/** @format */

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Alert, Card, CardContent, Grid, Snackbar, Tab } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams, useNavigate } from "react-router-dom";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import { Box, Button } from "@mui/material";
import AdditionalItemsModal from "./components/AdditionalItemsModal";
import ChangeMealPlanModal from "./components/ChangeMealPlanModal";
import DeliveryDetailsDrawer from "./components/DeliveryDetailsDrawer";
import EditClientModal from "./components/EditClientModal";
import MealReplacementModal from "./components/MealReplacementModal";
import CancelDeliveryModal from "./components/CancelDeliveryModal";
import MoveDeliveryModal from "./components/MoveDeliveryModal";
import ChangeDeliveryMethodModal from "./components/ChangeDeliveryMethodModal";
import {
  buildDeliveryCalendar,
  mockActivityLogs,
  mockClient,
} from "./mockData";
import ActivityAuditTab from "./tabs/ActivityAuditTab";
import AdjustmentsReplaceTab from "./tabs/AdjustmentsReplaceTab";
import DeliveryCalendarTab from "./tabs/DeliveryCalendarTab";
import ProfileOverviewTab from "./tabs/ProfileOverviewTab";
import { ClientAccountData, DeliveryDay } from "./types";

type ScopeOption = "thisDay" | "upcoming" | "entireOrder" | "mealPlanOnly";

const TAB_PROFILE = "profile";
const TAB_CALENDAR = "calendar";
const TAB_ADJUSTMENTS = "adjustments";
const TAB_ACTIVITY = "activity";

const ClientAccountAccessPage = () => {
  const { messages } = useIntl();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TAB_PROFILE);
  const [client, setClient] = useState<ClientAccountData>(mockClient);
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDay | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [changeMethodOpen, setChangeMethodOpen] = useState(false);
  const [cutoffEnabled, setCutoffEnabled] = useState(true);
  const [cutoffValue, setCutoffValue] = useState(48);
  const [cutoffUnit, setCutoffUnit] = useState("Hours");

  const [editClientOpen, setEditClientOpen] = useState(false);
  const [additionalItemsOpen, setAdditionalItemsOpen] = useState(false);
  const [changeMealPlanOpen, setChangeMealPlanOpen] = useState(false);
  const [mealReplacementOpen, setMealReplacementOpen] = useState(false);
  const [notifySnack, setNotifySnack] = useState(false);

  const deliveries = useMemo(
    () => buildDeliveryCalendar(calendarMonth),
    [calendarMonth]
  );

  const clientIdParam = searchParams.get("clientId");
  const displayClient = clientIdParam
    ? { ...client, customerId: clientIdParam }
    : client;

  const handleDayClick = (delivery: DeliveryDay) => {
    setSelectedDelivery(delivery);
    setSelectedDate(dayjs(delivery.date));
    setDrawerOpen(true);
  };

  const handleSelectedDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      const match = deliveries.find((d) => d.date === date.format("YYYY-MM-DD"));
      setSelectedDelivery(match ?? null);
    }
  };

  const handleBlock = (
    type: "oneDay" | "custom" | "permanent",
    expiry?: Dayjs
  ) => {
    setClient((prev) => ({
      ...prev,
      accessStatus: type === "permanent" ? "Blocked" : "TemporaryBlock",
      blockExpiryDate:
        type === "permanent"
          ? undefined
          : type === "oneDay"
            ? dayjs().add(1, "day").toISOString()
            : expiry?.toISOString(),
    }));
  };

  const handleUnblock = () => {
    setClient((prev) => ({
      ...prev,
      accessStatus: "Active",
      blockExpiryDate: undefined,
    }));
  };

  const goToAdjustments = () => {
    setActiveTab(TAB_ADJUSTMENTS);
    setDrawerOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <AppBreadcrumb
            paths={[
              {
                name: messages["sidebar.clientsManagement.title"],
                path: "/clientsManagement/clients",
              },
              { name: messages["sidebar.clients"] },
            ]}
            currentPathName="sidebar.clientAccountAccess"
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TabContext value={activeTab}>
              <TabList onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                <Tab
                  label={<IntlMessages id="clientAccountAccess.tabs.profile" />}
                  value={TAB_PROFILE}
                />
                <Tab
                  label={<IntlMessages id="clientAccountAccess.tabs.calendar" />}
                  value={TAB_CALENDAR}
                />
                <Tab
                  label={<IntlMessages id="clientAccountAccess.tabs.adjustments" />}
                  value={TAB_ADJUSTMENTS}
                />
                <Tab
                  label={<IntlMessages id="clientAccountAccess.tabs.activity" />}
                  value={TAB_ACTIVITY}
                />
              </TabList>

              <TabPanel value={TAB_PROFILE} sx={{ p: 0 }}>
                <ProfileOverviewTab
                  client={displayClient}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                  onEdit={() => setEditClientOpen(true)}
                  onSendNotification={() => setNotifySnack(true)}
                />
              </TabPanel>

              <TabPanel value={TAB_CALENDAR} sx={{ p: 0 }}>
                <DeliveryCalendarTab
                  month={calendarMonth}
                  deliveries={deliveries}
                  selectedDelivery={selectedDelivery}
                  onMonthChange={setCalendarMonth}
                  onDayClick={handleDayClick}
                />
              </TabPanel>

              <TabPanel value={TAB_ADJUSTMENTS} sx={{ p: 0 }}>
                <AdjustmentsReplaceTab
                  selectedDelivery={selectedDelivery}
                  selectedDate={selectedDate}
                  onSelectedDateChange={handleSelectedDateChange}
                  deliveries={deliveries}
                  cutoffEnabled={cutoffEnabled}
                  cutoffValue={cutoffValue}
                  cutoffUnit={cutoffUnit}
                  onCutoffEnabledChange={setCutoffEnabled}
                  onCutoffValueChange={setCutoffValue}
                  onCutoffUnitChange={setCutoffUnit}
                  onOpenChangeMethod={() => setChangeMethodOpen(true)}
                  onOpenCancelDelivery={() => setCancelOpen(true)}
                  onOpenMoveDelivery={() => setMoveOpen(true)}
                  onOpenAdditionalItems={() => setAdditionalItemsOpen(true)}
                  onOpenChangeMealPlan={() => setChangeMealPlanOpen(true)}
                  onOpenReplaceMeals={() => setMealReplacementOpen(true)}
                />
              </TabPanel>

              <TabPanel value={TAB_ACTIVITY} sx={{ p: 0 }}>
                <ActivityAuditTab logs={mockActivityLogs} />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>

      <DeliveryDetailsDrawer
        open={drawerOpen}
        delivery={selectedDelivery}
        onClose={() => setDrawerOpen(false)}
        onChangeMethod={() => {
          setDrawerOpen(false);
          setChangeMethodOpen(true);
        }}
        onCancelDelivery={() => {
          setDrawerOpen(false);
          setCancelOpen(true);
        }}
        onMoveDelivery={() => {
          setDrawerOpen(false);
          setMoveOpen(true);
        }}
        onReplaceMeals={() => {
          setDrawerOpen(false);
          setMealReplacementOpen(true);
        }}
        onAddItems={() => {
          setDrawerOpen(false);
          setAdditionalItemsOpen(true);
        }}
        onChangeMealPlan={() => {
          setDrawerOpen(false);
          setChangeMealPlanOpen(true);
        }}
      />

      <EditClientModal
        open={editClientOpen}
        client={displayClient}
        onClose={() => setEditClientOpen(false)}
        onSave={setClient}
      />

      <CancelDeliveryModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onSave={() => {}}
      />

      <MoveDeliveryModal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        onSave={() => {}}
      />

      <ChangeDeliveryMethodModal
        open={changeMethodOpen}
        delivery={selectedDelivery}
        onClose={() => setChangeMethodOpen(false)}
        onSave={() => {}}
      />

      <AdditionalItemsModal
        open={additionalItemsOpen}
        onClose={() => setAdditionalItemsOpen(false)}
        onSave={() => {}}
      />

      <ChangeMealPlanModal
        open={changeMealPlanOpen}
        onClose={() => setChangeMealPlanOpen(false)}
        onApply={() => {}}
      />

      <MealReplacementModal
        open={mealReplacementOpen}
        onClose={() => setMealReplacementOpen(false)}
        onSave={() => {}}
      />

      <Snackbar
        open={notifySnack}
        autoHideDuration={4000}
        onClose={() => setNotifySnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setNotifySnack(false)}>
          <IntlMessages id="clientAccountAccess.notificationSent" />
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ClientAccountAccessPage;

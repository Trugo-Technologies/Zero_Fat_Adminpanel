/** @format */

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, CardContent, Grid, Tab } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { getApiErrorMessage } from "src/Helpers/get-api-error-message";
import { showErrorToasts } from "src/Components/toasts";
import AdditionalItemsModal from "./components/AdditionalItemsModal";
import ChangeMealPlanModal from "./components/ChangeMealPlanModal";
import DeliveryDetailsDrawer from "./components/DeliveryDetailsDrawer";
import EditClientModal from "./components/EditClientModal";
import MealReplacementModal from "./components/MealReplacementModal";
import CancelDeliveryModal from "./components/CancelDeliveryModal";
import MoveDeliveryModal, { MoveDeliverySavePayload } from "./components/MoveDeliveryModal";
import ResumeDeliveryModal from "./components/ResumeDeliveryModal";
import ChangeDeliveryMethodModal from "./components/ChangeDeliveryMethodModal";
import ClientAccountAccessClientSearch from "./components/ClientAccountAccessClientSearch";
import { mockActivityLogs } from "./mockData";
import {
  deliveryCalendarStatusFilterToApi,
  DeliveryCalendarStatusFilter,
} from "./deliveryCalendarStatuses";
import {
  DeliveryCancelScopeOption,
  deliveryCancelScopeToApi,
  deliveryActionScopeToApi,
} from "./deliveryCalendarActions";
import { mapDeliveryCalendarDays } from "./mapDeliveryCalendar";
import ActivityAuditTab from "./tabs/ActivityAuditTab";
import AdjustmentsReplaceTab from "./tabs/AdjustmentsReplaceTab";
import DeliveryCalendarTab from "./tabs/DeliveryCalendarTab";
import ProfileOverviewTab from "./tabs/ProfileOverviewTab";
import { mapClientAccountAccessToClientData, buildBlockClientAccountAccessPayload } from "./mapClientAccountData";
import {
  useBlockClientAccountAccessMutation,
  useGetClientAccountAccessQuery,
  useGetDeliveryCalendarQuery,
  useGetDeliveryCalendarPauseStatusQuery,
  useChangeDeliveryCalendarPaymentMethodMutation,
  useCancelDeliveryCalendarMutation,
  useMoveDeliveryCalendarMutation,
  usePauseDeliveryCalendarMutation,
  useResumeDeliveryCalendarMutation,
  useChangeDeliveryCalendarMealPlanMutation,
  useUnblockClientAccountAccessMutation,
} from "./services/api";
import { useGetClientPortalSettingsQuery } from "src/pages/clients-module/clientPortalSettings/services/api";
import { IChangeDeliveryCalendarMealSlot } from "src/types/modules/clientsManagement/clientAccountAccess";
import { mapClientPortalSettingsToCutoff } from "./deliveryCutoff";
import { ClientAccountData, DeliveryDay, emptyClientAccountData } from "./types";
import { IClient } from "src/types/modules/clientsManagement/clients";

const TAB_PROFILE = "profile";
const TAB_CALENDAR = "calendar";
const TAB_ADJUSTMENTS = "adjustments";
const TAB_ACTIVITY = "activity";

const ClientAccountAccessPage = () => {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const clientIdParam = searchParams.get("clientId");
  const hasSelectedClient = Boolean(clientIdParam);
  const { user, isAuthenticated } = useAuthUser();
  const hasAdminRole = Array.isArray(user?.role)
    ? user.role.includes("admin")
    : user?.role === "admin";
  // JWT auth does not always populate role; treat authenticated admin-panel users as admin.
  const isAdmin = isAuthenticated && (hasAdminRole || user?.role == null);

  const [bypassCutoffValidation, setBypassCutoffValidation] = useState(false);

  useEffect(() => {
    if (!isAdmin) setBypassCutoffValidation(false);
  }, [isAdmin]);
  const {
    data: clientAccountAccess,
    isLoading,
    error,
  } = useGetClientAccountAccessQuery(
    { clientId: clientIdParam || "" },
    { skip: !clientIdParam }
  );
  const {
    data: clientPortalSettings,
    isLoading: isCutoffLoading,
  } = useGetClientPortalSettingsQuery({});
  const [blockClientAccountAccess, { isLoading: isBlocking }] =
    useBlockClientAccountAccessMutation();
  const [unblockClientAccountAccess, { isLoading: isUnblocking }] =
    useUnblockClientAccountAccessMutation();
  const [changeDeliveryCalendarPaymentMethod, { isLoading: isChangingPaymentMethod }] =
    useChangeDeliveryCalendarPaymentMethodMutation();
  const [cancelDeliveryCalendar, { isLoading: isCancellingDelivery }] =
    useCancelDeliveryCalendarMutation();
  const [moveDeliveryCalendar, { isLoading: isMovingDelivery }] =
    useMoveDeliveryCalendarMutation();
  const [pauseDeliveryCalendar, { isLoading: isPausingDelivery }] =
    usePauseDeliveryCalendarMutation();
  const [resumeDeliveryCalendar, { isLoading: isResumingDelivery }] =
    useResumeDeliveryCalendarMutation();
  const [changeDeliveryCalendarMealPlan, { isLoading: isChangingMealPlan }] =
    useChangeDeliveryCalendarMealPlanMutation();

  const [activeTab, setActiveTab] = useState(TAB_PROFILE);
  const [client, setClient] = useState<ClientAccountData>(emptyClientAccountData);
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [calendarStatusFilter, setCalendarStatusFilter] =
    useState<DeliveryCalendarStatusFilter>("All Status");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDay | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [changeMethodOpen, setChangeMethodOpen] = useState(false);

  const [editClientOpen, setEditClientOpen] = useState(false);
  const [additionalItemsOpen, setAdditionalItemsOpen] = useState(false);
  const [changeMealPlanOpen, setChangeMealPlanOpen] = useState(false);
  const [mealReplacementOpen, setMealReplacementOpen] = useState(false);
  const [deliveryActionError, setDeliveryActionError] = useState<string | null>(null);

  const {
    data: deliveryCalendarResponse,
    isFetching: isDeliveryCalendarLoading,
  } = useGetDeliveryCalendarQuery(
    {
      clientId: clientIdParam || "",
      month: calendarMonth.month() + 1,
      year: calendarMonth.year(),
      status: deliveryCalendarStatusFilterToApi(calendarStatusFilter),
    },
    { skip: !clientIdParam }
  );

  const { data: pauseStatusResponse } = useGetDeliveryCalendarPauseStatusQuery(
    { clientId: clientIdParam || "" },
    { skip: !clientIdParam }
  );
  const pauseStatus = pauseStatusResponse?.data ?? null;

  const deliveries = useMemo(() => {
    if (clientIdParam && deliveryCalendarResponse?.data) {
      return mapDeliveryCalendarDays(deliveryCalendarResponse.data.days);
    }

    return [];
  }, [clientIdParam, deliveryCalendarResponse]);

  const deliveryCalendarSummary = deliveryCalendarResponse?.data?.summary;

  useEffect(() => {
    if (clientAccountAccess?.data && clientIdParam) {
      setClient(mapClientAccountAccessToClientData(clientAccountAccess.data));
    } else if (!clientIdParam) {
      setClient(emptyClientAccountData);
    }
  }, [clientAccountAccess, clientIdParam]);

  const errorMessage =
    (error as { response?: { data?: { messages?: string[] } } })?.response
      ?.data?.messages?.[0] ?? null;

  const activeDeliveryDate =
    selectedDelivery?.date ?? selectedDate?.format("YYYY-MM-DD") ?? null;

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

  const handleBlock = async (
    type: "oneDay" | "custom" | "permanent",
    expiry?: Dayjs
  ) => {
    if (!clientIdParam) return;

    try {
      const payload = buildBlockClientAccountAccessPayload(
        clientIdParam,
        type,
        expiry
      );
      const result = await blockClientAccountAccess({
        clientId: clientIdParam,
        data: payload,
      }).unwrap();

      if (result?.data) {
        setClient(mapClientAccountAccessToClientData(result.data));
      }
    } catch {
      // Error toast handled in mutation
    }
  };

  const handleUnblock = async () => {
    if (!clientIdParam) return;

    try {
      const result = await unblockClientAccountAccess({
        clientId: clientIdParam,
      }).unwrap();

      if (result?.data) {
        setClient(mapClientAccountAccessToClientData(result.data));
      }
    } catch {
      // Error toast handled in mutation
    }
  };

  const handleChangePaymentMethod = async (paymentMethod: string) => {
    if (!clientIdParam || !activeDeliveryDate) return;

    setDeliveryActionError(null);
    try {
      await changeDeliveryCalendarPaymentMethod({
        clientId: clientIdParam,
        data: {
          clientId: clientIdParam,
          date: activeDeliveryDate,
          paymentMethod,
          ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
        },
      }).unwrap();
      setChangeMethodOpen(false);
      setDrawerOpen(false);
      setDeliveryActionError(null);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setDeliveryActionError(message);
      showErrorToasts(message);
    }
  };

  const handleCancelDelivery = async (
    scope: DeliveryCancelScopeOption,
    mealTypeIds: string[]
  ) => {
    if (!clientIdParam || !activeDeliveryDate) return;

    setDeliveryActionError(null);
    try {
      await cancelDeliveryCalendar({
        clientId: clientIdParam,
        data: {
          clientId: clientIdParam,
          date: activeDeliveryDate,
          scope: deliveryCancelScopeToApi(scope),
          mealTypeIds: scope === "mealPlanOnly" ? mealTypeIds : [],
          ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
        },
      }).unwrap();
      setCancelOpen(false);
      setDrawerOpen(false);
      setDeliveryActionError(null);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setDeliveryActionError(message);
      showErrorToasts(message);
    }
  };

  const handleMoveDelivery = async (payload: MoveDeliverySavePayload) => {
    if (!clientIdParam || !activeDeliveryDate) return;

    setDeliveryActionError(null);
    try {
      if (payload.kind === "pause") {
        await pauseDeliveryCalendar({
          clientId: clientIdParam,
          data: {
            clientId: clientIdParam,
            date: payload.pauseDate,
            scope: deliveryActionScopeToApi("upcoming"),
            ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
          },
        }).unwrap();
      } else {
        await moveDeliveryCalendar({
          clientId: clientIdParam,
          data: {
            clientId: clientIdParam,
            date: activeDeliveryDate,
            newDeliveryDate: payload.newDeliveryDate,
            scope: deliveryActionScopeToApi(payload.scope),
            mealTypeIds:
              payload.scope === "mealPlanOnly" ? payload.mealTypeIds : [],
            bypassResumeWindow: payload.bypassResumeWindow,
            ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
          },
        }).unwrap();
      }

      setMoveOpen(false);
      setDrawerOpen(false);
      setDeliveryActionError(null);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setDeliveryActionError(message);
      showErrorToasts(message);
    }
  };

  const handleResumeDelivery = async (
    resumeDate: string,
    bypassResumeWindow: boolean
  ) => {
    if (!clientIdParam) return;

    setDeliveryActionError(null);
    try {
      await resumeDeliveryCalendar({
        clientId: clientIdParam,
        data: {
          clientId: clientIdParam,
          resumeDate,
          ...(bypassResumeWindow ? { bypassResumeWindow: true } : {}),
          ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
        },
      }).unwrap();

      setResumeOpen(false);
      setDeliveryActionError(null);
      // Resumed days may land in a later month; jump the calendar there.
      setCalendarMonth(dayjs(resumeDate));
    } catch (error) {
      const message = getApiErrorMessage(error);
      setDeliveryActionError(message);
      showErrorToasts(message);
    }
  };

  const handleChangeMealPlan = async (payload: {
    mealPlanId: string;
    planVariant: string;
    calorieTarget: number;
    mealsPerDay: number;
    mealSlots: IChangeDeliveryCalendarMealSlot[];
    applyStartingFromThisDay: boolean;
    waivePayment: boolean;
    paymentProvider?: "Stripe" | "Tamara";
  }) => {
    if (!clientIdParam || !activeDeliveryDate) return;

    setDeliveryActionError(null);
    try {
      await changeDeliveryCalendarMealPlan({
        clientId: clientIdParam,
        data: {
          clientId: clientIdParam,
          date: activeDeliveryDate,
          ...payload,
          ...(bypassCutoffValidation ? { bypassCutoff: true } : {}),
        },
      }).unwrap();
      setChangeMealPlanOpen(false);
      setDrawerOpen(false);
      setDeliveryActionError(null);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setDeliveryActionError(message);
      showErrorToasts(message);
    }
  };

  const goToAdjustments = () => {
    setActiveTab(TAB_ADJUSTMENTS);
    setDrawerOpen(false);
  };

  const handleClientSearch = (selectedClient: IClient) => {
    setSearchParams({ clientId: selectedClient.id });
  };

  return (
    <LoadingAndErrorWrapper
      isLoading={Boolean(clientIdParam) && isLoading}
      errorMessage={clientIdParam ? errorMessage : null}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <AppBreadcrumb
              paths={[
                {
                  name: messages["sidebar.clientsManagement.title"],
                  path: "/clientsManagement/clients",
                },
                {
                  name: messages["sidebar.clients"],
                  path: "/clientsManagement/clients",
                },
              ]}
              currentPathName="sidebar.clientAccountAccess"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <ClientAccountAccessClientSearch
            selectedClientId={clientIdParam}
            onSearch={handleClientSearch}
          />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ position: "relative", overflow: "hidden" }}>
            <CardContent>
              <TabContext value={activeTab}>
              <TabList
                onChange={(_, v) => hasSelectedClient && setActiveTab(v)}
                sx={{
                  mb: 2,
                  pointerEvents: hasSelectedClient ? "auto" : "none",
                  opacity: hasSelectedClient ? 1 : 0.55,
                }}
              >
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

              <Box
                sx={{
                  position: "relative",
                  pointerEvents: hasSelectedClient ? "auto" : "none",
                  opacity: hasSelectedClient ? 1 : 0.45,
                  filter: hasSelectedClient ? "none" : "blur(3px)",
                  transition: "opacity 0.2s ease, filter 0.2s ease",
                }}
              >
              <TabPanel value={TAB_PROFILE} sx={{ p: 0 }}>
                <ProfileOverviewTab
                  client={client}
                  clientId={clientIdParam}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                  isBlocking={isBlocking}
                  isUnblocking={isUnblocking}
                  onEdit={() => setEditClientOpen(true)}
                  onSendNotification={() => {
                    if (!clientIdParam) return;
                    navigate(
                      `/clientsManagement/clientAccountAccess/notifications?clientId=${clientIdParam}`
                    );
                  }}
                />
              </TabPanel>

              <TabPanel value={TAB_CALENDAR} sx={{ p: 0 }}>
                <DeliveryCalendarTab
                  month={calendarMonth}
                  deliveries={deliveries}
                  summary={deliveryCalendarSummary}
                  selectedDelivery={selectedDelivery}
                  statusFilter={calendarStatusFilter}
                  onStatusFilterChange={setCalendarStatusFilter}
                  onMonthChange={setCalendarMonth}
                  onDayClick={handleDayClick}
                  isLoading={Boolean(clientIdParam) && isDeliveryCalendarLoading}
                  useClientSideStatusFilter={false}
                  canBypassCutoff={isAdmin}
                  bypassCutoffEnabled={bypassCutoffValidation}
                  onBypassCutoffEnabledChange={setBypassCutoffValidation}
                  pauseStatus={pauseStatus}
                  onResumeClick={() => {
                    setDeliveryActionError(null);
                    setResumeOpen(true);
                  }}
                />
              </TabPanel>

              <TabPanel value={TAB_ADJUSTMENTS} sx={{ p: 0 }}>
                <AdjustmentsReplaceTab
                  selectedDelivery={selectedDelivery}
                  selectedDate={selectedDate}
                  onSelectedDateChange={handleSelectedDateChange}
                  deliveries={deliveries}
                  cutoffSettings={mapClientPortalSettingsToCutoff(
                    clientPortalSettings?.data
                  )}
                  isCutoffLoading={isCutoffLoading}
                  canBypassCutoff={isAdmin}
                  bypassCutoffEnabled={bypassCutoffValidation}
                  onBypassCutoffEnabledChange={setBypassCutoffValidation}
                  onOpenChangeMethod={() => setChangeMethodOpen(true)}
                  onOpenCancelDelivery={() => setCancelOpen(true)}
                  onOpenMoveDelivery={() => setMoveOpen(true)}
                  onOpenAdditionalItems={() => setAdditionalItemsOpen(true)}
                  onOpenChangeMealPlan={() => setChangeMealPlanOpen(true)}
                  onOpenReplaceMeals={() => setMealReplacementOpen(true)}
                />
              </TabPanel>

              <TabPanel value={TAB_ACTIVITY} sx={{ p: 0 }}>
                <ActivityAuditTab
                  clientId={clientIdParam}
                  fallbackLogs={hasSelectedClient ? mockActivityLogs : []}
                />
              </TabPanel>
              </Box>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>

      <DeliveryDetailsDrawer
        open={drawerOpen}
        clientId={clientIdParam}
        delivery={selectedDelivery}
        bypassCutoffEnabled={bypassCutoffValidation}
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
        client={client}
        clientId={clientIdParam}
        onClose={() => setEditClientOpen(false)}
        onSave={setClient}
      />

      <CancelDeliveryModal
        open={cancelOpen}
        clientId={clientIdParam}
        date={activeDeliveryDate}
        onClose={() => {
          setCancelOpen(false);
          setDeliveryActionError(null);
        }}
        onSave={handleCancelDelivery}
        isSaving={isCancellingDelivery}
        errorMessage={deliveryActionError}
      />

      <MoveDeliveryModal
        open={moveOpen}
        clientId={clientIdParam}
        date={activeDeliveryDate}
        onClose={() => {
          setMoveOpen(false);
          setDeliveryActionError(null);
        }}
        onSave={handleMoveDelivery}
        isSaving={isMovingDelivery || isPausingDelivery}
        errorMessage={deliveryActionError}
      />

      <ResumeDeliveryModal
        open={resumeOpen}
        pauseStatus={pauseStatus}
        canBypassResumeWindow={isAdmin}
        onClose={() => {
          setResumeOpen(false);
          setDeliveryActionError(null);
        }}
        onSave={handleResumeDelivery}
        isSaving={isResumingDelivery}
        errorMessage={deliveryActionError}
      />

      <ChangeDeliveryMethodModal
        open={changeMethodOpen}
        clientId={clientIdParam}
        delivery={selectedDelivery}
        onClose={() => {
          setChangeMethodOpen(false);
          setDeliveryActionError(null);
        }}
        onSave={handleChangePaymentMethod}
        isSaving={isChangingPaymentMethod}
        errorMessage={deliveryActionError}
      />

      <AdditionalItemsModal
        open={additionalItemsOpen}
        clientId={clientIdParam}
        date={activeDeliveryDate}
        bypassCutoffEnabled={bypassCutoffValidation}
        onClose={() => {
          setAdditionalItemsOpen(false);
          setDeliveryActionError(null);
        }}
        onSaved={() => {
          setAdditionalItemsOpen(false);
          setDrawerOpen(false);
          setDeliveryActionError(null);
        }}
        errorMessage={deliveryActionError}
      />

      <ChangeMealPlanModal
        open={changeMealPlanOpen}
        clientId={clientIdParam}
        date={activeDeliveryDate}
        bypassCutoffEnabled={bypassCutoffValidation}
        onClose={() => {
          setChangeMealPlanOpen(false);
          setDeliveryActionError(null);
        }}
        onApply={handleChangeMealPlan}
        isSaving={isChangingMealPlan}
        errorMessage={deliveryActionError}
      />

      <MealReplacementModal
        open={mealReplacementOpen}
        clientId={clientIdParam}
        date={activeDeliveryDate}
        bypassCutoffEnabled={bypassCutoffValidation}
        onClose={() => {
          setMealReplacementOpen(false);
          setDrawerOpen(false);
          setDeliveryActionError(null);
        }}
        errorMessage={deliveryActionError}
      />
      </Grid>
    </LoadingAndErrorWrapper>
  );
};

export default ClientAccountAccessPage;

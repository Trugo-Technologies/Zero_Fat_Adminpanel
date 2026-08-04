import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Card, CircularProgress, Grid, Step, StepLabel, Stepper, Typography, Button, Stack, alpha } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import {
  useGetClientAccountAccessQuery,
  useGetSubscriptionWizardDraftQuery,
  useGetSubscriptionWizardPreviewQuery,
  useUpdateSubscriptionWizardConfigurationMutation,
  useUpdateSubscriptionWizardRenewalOptionsMutation,
  useUpdateSubscriptionWizardScheduleMutation,
  useUpdateSubscriptionWizardBillingMutation,
  useSaveSubscriptionWizardDraftMutation,
  useFinalizeSubscriptionWizardMutation,
} from "./services/api";
import { canRenewSubscription, mapClientAccountAccessToClientData } from "./mapClientAccountData";
import {
  buildBillingPayload,
  buildConfigurationPayload,
  buildFinalizePayload,
  buildRenewalOptionsPayload,
  buildSchedulePayload,
  mapSubscriptionWizardDraftToFormState,
} from "./mapSubscriptionWizardDraft";
import { ISubscriptionWizardMealTypeSelection, SubscriptionWizardPaymentProvider } from "src/types/modules/clientsManagement/clientAccountAccess";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { getMealTypeSelectionsTotalCalories } from "./mealPlanHelpers";
import { showErrorToasts, showSuccessToasts } from "src/Components/toasts";
import { RenewalStrategyUi } from "./mapSubscriptionWizardDraft";
import { DEFAULT_SELECTED_WEEKDAYS, getFirstAvailableDeliveryDate, getMinDeliveryDatesForDuration } from "./subscriptionWizardSchedule";

import Step0RenewalStrategy from "./components/createSubscription/Step0RenewalStrategy";
import Step1Configuration from "./components/createSubscription/Step1Configuration";
import Step2Schedule from "./components/createSubscription/Step2Schedule";
import Step5Billing from "./components/createSubscription/Step5Billing";
import { CartItem } from "./components/createSubscription/Step1Configuration";

const CreateSubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get("draftId");
  const { data: wizardDraftResponse, isLoading: isWizardDraftLoading } =
    useGetSubscriptionWizardDraftQuery(
      { draftId: draftId || "" },
      { skip: !draftId }
    );
  const clientId =
    searchParams.get("clientId") ||
    wizardDraftResponse?.data?.clientId ||
    null;

  const { data: clientAccountAccess } = useGetClientAccountAccessQuery(
    { clientId: clientId || "" },
    { skip: !clientId }
  );

  // "New" order type → New only; any other type (e.g. ExistingUser) → New + Renew.
  const allowRenewMode = useMemo(() => {
    if (!clientAccountAccess?.data) return false;

    return canRenewSubscription(
      mapClientAccountAccessToClientData(clientAccountAccess.data)
    );
  }, [clientAccountAccess?.data]);

  const { data: mealPlansResponse } = useGetActiveMealPlansQuery();
  const [updateRenewalOptions, { isLoading: isSavingRenewalOptions }] =
    useUpdateSubscriptionWizardRenewalOptionsMutation();
  const [updateConfiguration, { isLoading: isSavingConfiguration }] =
    useUpdateSubscriptionWizardConfigurationMutation();
  const [updateSchedule, { isLoading: isSavingSchedule }] =
    useUpdateSubscriptionWizardScheduleMutation();
  const [updateBilling, { isLoading: isSavingBilling }] =
    useUpdateSubscriptionWizardBillingMutation();
  const [saveWizardDraft, { isLoading: isSavingDraft }] =
    useSaveSubscriptionWizardDraftMutation();
  const [finalizeSubscriptionWizard, { isLoading: isFinalizing }] =
    useFinalizeSubscriptionWizardMutation();

  const [activeStep, setActiveStep] = useState(0);

  const [subscriptionMode, setSubscriptionMode] = useState<"new" | "renew">(
    searchParams.get("wizardMode") === "Renew" ? "renew" : "new"
  );

  useEffect(() => {
    if (!allowRenewMode && subscriptionMode === "renew") {
      setSubscriptionMode("new");
      setActiveStep(0);
    }
  }, [allowRenewMode, subscriptionMode]);
  
  // Step 0: Renewal Strategy (only for renew mode)
  const [renewalStrategy, setRenewalStrategy] = useState<"extend" | "future">("extend");
  const [scheduledStartDate, setScheduledStartDate] = useState<Dayjs | null>(null);

  // Step 1
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mealTypeSelections, setMealTypeSelections] = useState<
    ISubscriptionWizardMealTypeSelection[]
  >([]);

  // Step 2
  const [duration, setDuration] = useState("1 Month");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(
    DEFAULT_SELECTED_WEEKDAYS
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    searchParams.get("wizardMode") === "Renew"
      ? null
      : getFirstAvailableDeliveryDate({
          selectedWeekdays: DEFAULT_SELECTED_WEEKDAYS,
        })
  );
  const [selectedDeliveryDates, setSelectedDeliveryDates] = useState<string[]>(
    []
  );
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState<string>(
    PreferredDeliveryTime.EarlyMorning
  );
  const [clientLocationId, setClientLocationId] = useState("");

  // Step 3 (not a step anymore, but state needed for addons)
  const [enableAddons, setEnableAddons] = useState(false);
  const [addonTab, setAddonTab] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Step 5 (now Billing & Review)
  const [promoCode, setPromoCode] = useState("");
  const [manualDiscount, setManualDiscount] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentProvider, setPaymentProvider] =
    useState<SubscriptionWizardPaymentProvider>("Stripe");
  const hasHydratedDraftStep = useRef(false);

  useEffect(() => {
    hasHydratedDraftStep.current = false;
  }, [draftId]);

  useEffect(() => {
    if (!wizardDraftResponse?.data) return;

    const mapped = mapSubscriptionWizardDraftToFormState(wizardDraftResponse.data);

    if (!hasHydratedDraftStep.current) {
      hasHydratedDraftStep.current = true;
      setActiveStep(mapped.activeStep);
      setSubscriptionMode(mapped.subscriptionMode);
    }

    setRenewalStrategy(mapped.renewalStrategy);
    setScheduledStartDate(mapped.scheduledStartDate);
    setSelectedPlan(mapped.selectedPlan);
    setMealTypeSelections(mapped.mealTypeSelections);
    setEnableAddons(mapped.enableAddons);
    setCart(mapped.cart);
    setDuration(mapped.duration);
    setSelectedWeekdays(mapped.selectedWeekdays);
    setSelectedDate(mapped.selectedDate);
    setSelectedDeliveryDates(mapped.selectedDeliveryDates);
    setPreferredDeliveryTime(mapped.preferredDeliveryTime);
    setClientLocationId(mapped.clientLocationId);
    setPromoCode(mapped.promoCode);
    setManualDiscount(mapped.manualDiscount);
    setCustomerEmail(mapped.customerEmail);
    setPaymentMessage(mapped.paymentMessage);
  }, [wizardDraftResponse]);

  const steps = useMemo(() => {
    return subscriptionMode === "renew" 
      ? ["Renewal Options", "Configuration", "Schedule", "Billing & Review"]
      : ["Configuration", "Schedule", "Billing & Review"];
  }, [subscriptionMode]);

  const isBillingStep = steps[activeStep] === "Billing & Review";
  const { data: previewResponse, isFetching: isPreviewLoading } =
    useGetSubscriptionWizardPreviewQuery(
      { draftId: draftId || "" },
      { skip: !draftId || !isBillingStep }
    );
  const preview = previewResponse?.data ?? null;

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleRenewalStrategyChange = (strategy: RenewalStrategyUi) => {
    if (strategy === "future") {
      setSelectedDate(null);
      return;
    }

    setScheduledStartDate(null);
  };

  const handleScheduledStartDateChange = (date: Dayjs | null) => {
    setScheduledStartDate(date);

    if (renewalStrategy === "future") {
      setSelectedDate(date);
    }
  };

  const handleRenewalOptionsNext = async () => {
    if (!draftId) {
      handleNext();
      return;
    }

    if (renewalStrategy === "future" && !scheduledStartDate) {
      showErrorToasts("Please select a start date");
      return;
    }

    try {
      await updateRenewalOptions({
        draftId,
        data: buildRenewalOptionsPayload(
          draftId,
          renewalStrategy,
          scheduledStartDate
        ),
      }).unwrap();

      if (renewalStrategy === "future" && scheduledStartDate) {
        setSelectedDate(scheduledStartDate);
      }

      handleNext();
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleConfigurationNext = async () => {
    if (!draftId) {
      handleNext();
      return;
    }

    if (!selectedPlan) {
      showErrorToasts("Please select a meal plan");
      return;
    }

    if (mealTypeSelections.length === 0) {
      showErrorToasts("Please select at least one meal type");
      return;
    }

    if (mealTypeSelections.some((meal) => !meal.mealTypeId)) {
      showErrorToasts("Please wait for meal types to load");
      return;
    }

    const selectedMealPlan = mealPlansResponse?.data?.find(
      (plan) => plan.id === selectedPlan
    );
    const calorieTarget = getMealTypeSelectionsTotalCalories(
      selectedMealPlan,
      mealTypeSelections
    );

    if (calorieTarget <= 0) {
      showErrorToasts("Please complete your meal selection");
      return;
    }

    try {
      await updateConfiguration({
        draftId,
        data: buildConfigurationPayload(draftId, {
          selectedPlan,
          calorieTarget,
          mealTypeSelections,
          cart,
        }),
      }).unwrap();
      handleNext();
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleScheduleNext = async () => {
    if (!draftId) {
      handleNext();
      return;
    }

    if (selectedDeliveryDates.length === 0) {
      showErrorToasts("Please select at least one delivery date");
      return;
    }

    if (
      duration !== "Custom" &&
      (selectedWeekdays.length < 4 || selectedWeekdays.length > 6)
    ) {
      showErrorToasts("Please select between 4 and 6 delivery days");
      return;
    }

    if (duration !== "Custom") {
      const minDates = getMinDeliveryDatesForDuration(duration);
      if (selectedDeliveryDates.length < minDates) {
        showErrorToasts(
          `Please select at least ${minDates} delivery date${minDates === 1 ? "" : "s"} for ${duration}.`
        );
        return;
      }
    }

    if (!clientLocationId) {
      showErrorToasts("Please select a delivery address");
      return;
    }

    try {
      await updateSchedule({
        draftId,
        data: buildSchedulePayload(draftId, {
          duration,
          selectedWeekdays,
          selectedDate,
          selectedDeliveryDates,
          preferredDeliveryTime,
          clientLocationId,
          promoCode,
          manualDiscount,
        }),
      }).unwrap();
      handleNext();
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleSaveDraft = async () => {
    if (!draftId) return;

    try {
      await saveWizardDraft({ draftId }).unwrap();
      showSuccessToasts("Draft saved successfully");
      if (clientId) {
        navigate(`/clientsManagement/clientAccountAccess?clientId=${clientId}`);
      }
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleBillingSubmit = async () => {
    if (!draftId) return;

    if (!customerEmail.trim()) {
      showErrorToasts("Please enter customer email");
      return;
    }

    try {
      await updateBilling({
        draftId,
        data: buildBillingPayload(draftId, customerEmail.trim(), paymentMessage),
      }).unwrap();

      await finalizeSubscriptionWizard({
        draftId,
        data: buildFinalizePayload(draftId, paymentProvider),
      }).unwrap();

      showSuccessToasts("Payment link sent successfully");
      if (clientId) {
        navigate(`/clientsManagement/clientAccountAccess?clientId=${clientId}`);
      }
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleModeSwitch = (mode: "new" | "renew") => {
    if (mode === "renew" && !allowRenewMode) return;
    setSubscriptionMode(mode);
    setActiveStep(0); // Reset stepper on mode change
  };

  const renderActiveStepComponent = () => {
    const currentStepLabel = steps[activeStep];
    
    switch (currentStepLabel) {
      case "Renewal Options":
        return (
          <Step0RenewalStrategy 
            hasActiveSubscription={wizardDraftResponse?.data?.hasActiveSubscription}
            activeMealPlanName={wizardDraftResponse?.data?.activeMealPlanName}
            activeSubscriptionEndDate={wizardDraftResponse?.data?.activeSubscriptionEndDate}
            renewalStrategy={renewalStrategy}
            setRenewalStrategy={setRenewalStrategy}
            scheduledStartDate={scheduledStartDate}
            setScheduledStartDate={handleScheduledStartDateChange}
            onRenewalStrategyChange={handleRenewalStrategyChange}
            onNext={handleRenewalOptionsNext}
            isSaving={isSavingRenewalOptions}
          />
        );
      case "Configuration":
        return (
          <Step1Configuration
            clientId={clientId}
            subscriptionMode={subscriptionMode}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            mealTypeSelections={mealTypeSelections}
            setMealTypeSelections={setMealTypeSelections}
            enableAddons={enableAddons}
            setEnableAddons={setEnableAddons}
            addonTab={addonTab}
            setAddonTab={setAddonTab}
            cart={cart}
            setCart={setCart}
            onBack={activeStep > 0 ? handleBack : undefined}
            onNext={handleConfigurationNext}
            isSaving={isSavingConfiguration}
          />
        );
      case "Schedule":
        return (
          <Step2Schedule
            clientId={clientId}
            subscriptionMode={subscriptionMode}
            renewalStrategy={renewalStrategy}
            scheduledStartDate={scheduledStartDate}
            duration={duration}
            setDuration={setDuration}
            selectedWeekdays={selectedWeekdays}
            setSelectedWeekdays={setSelectedWeekdays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedDeliveryDates={selectedDeliveryDates}
            setSelectedDeliveryDates={setSelectedDeliveryDates}
            preferredDeliveryTime={preferredDeliveryTime}
            setPreferredDeliveryTime={setPreferredDeliveryTime}
            clientLocationId={clientLocationId}
            setClientLocationId={setClientLocationId}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            manualDiscount={manualDiscount}
            setManualDiscount={setManualDiscount}
            hasActiveSubscription={wizardDraftResponse?.data?.hasActiveSubscription}
            activeSubscriptionEndDate={wizardDraftResponse?.data?.activeSubscriptionEndDate}
            hasUpcomingSubscription={wizardDraftResponse?.data?.hasUpcomingSubscription}
            upcomingSubscriptionEndDate={wizardDraftResponse?.data?.upcomingSubscriptionEndDate}
            upcomingMealPlanName={wizardDraftResponse?.data?.upcomingMealPlanName}
            upcomingSelectedDeliveryDates={
              wizardDraftResponse?.data?.upcomingSelectedDeliveryDates
            }
            onBack={handleBack}
            onNext={handleScheduleNext}
            isSaving={isSavingSchedule}
          />
        );
      case "Billing & Review":
        return (
          <Step5Billing
            preview={preview}
            isPreviewLoading={isPreviewLoading}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            paymentMessage={paymentMessage}
            setPaymentMessage={setPaymentMessage}
            paymentProvider={paymentProvider}
            setPaymentProvider={setPaymentProvider}
            cart={cart}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleBillingSubmit}
            isSavingDraft={isSavingDraft}
            isSaving={isSavingBilling || isFinalizing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {draftId && isWizardDraftLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      <Box sx={{ mb: 4 }}>
        <AppBreadcrumb
          paths={[
            { name: "Clients", path: "/clientsManagement/clients" },
            { name: "Client Account Access", path: "/clientsManagement/clientAccountAccess" },
          ]}
          currentPathName="Create Subscription"
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
            Create Subscription
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            Create a new subscription or renew an existing one for your client.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={allowRenewMode ? 6 : 12}>
          <Box
            onClick={() => handleModeSwitch("new")}
            sx={{
              p: 2.5,
              borderRadius: 3,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: subscriptionMode === "new" ? "primary.main" : "#E2E8F0",
              bgcolor: subscriptionMode === "new" ? "#fff" : "#fff",
              boxShadow: subscriptionMode === "new" ? "0 4px 14px rgba(16,185,129,0.05)" : "none",
            }}
          >
            <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: subscriptionMode === "new" ? "primary.main" : "#CBD5E1", mr: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {subscriptionMode === "new" && <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>New Subscription</Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Create a brand new subscription</Typography>
            </Box>
          </Box>
        </Grid>
        {allowRenewMode ? (
          <Grid item xs={12} md={6}>
            <Box
              onClick={() => handleModeSwitch("renew")}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: subscriptionMode === "renew" ? "primary.main" : "#E2E8F0",
                bgcolor: subscriptionMode === "renew" ? "#fff" : "#fff",
                boxShadow: subscriptionMode === "renew" ? "0 4px 14px rgba(16,185,129,0.05)" : "none",
              }}
            >
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: subscriptionMode === "renew" ? "primary.main" : "#CBD5E1", mr: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {subscriptionMode === "renew" && <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Renew Subscription</Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Extend existing subscription</Typography>
              </Box>
            </Box>
          </Grid>
        ) : null}
      </Grid>

      <Box sx={{ mb: 4, bgcolor: "#fff", borderRadius: 3, border: "1px solid #E2E8F0", p: 1 }}>
        <Stack direction="row" sx={{ px: 1 }}>
          {steps.map((label, index) => {
            const isActive = activeStep === index;
            const isCompleted = index < activeStep;
            return (
              <Box
                key={label}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  py: 2,
                  position: "relative",
                  color: isActive || isCompleted ? "primary.main" : "text.secondary",
                  cursor: "pointer",
                  "&::after": isActive ? {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    right: 0,
                    height: 2,
                    bgcolor: "primary.main",
                  } : {}
                }}
              >
                {isCompleted ? (
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "primary.main", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</Box>
                ) : isActive ? (
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: alpha("#10B981", 0.1), color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{index + 1}</Box>
                ) : (
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #CBD5E1", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500 }}>{index + 1}</Box>
                )}
                <Typography sx={{ fontSize: 15, fontWeight: isActive ? 700 : 600, color: isActive ? "primary.main" : isCompleted ? "#0F172A" : "#64748B" }}>
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Box>
        {renderActiveStepComponent()}
      </Box>
        </>
      )}
    </Box>
  );
};

export default CreateSubscriptionPage;

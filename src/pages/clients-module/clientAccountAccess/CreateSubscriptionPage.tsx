import { useState, useMemo } from "react";
import { Box, Card, Grid, Step, StepLabel, Stepper, Typography, Button, Stack, alpha } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";

import Step0RenewalStrategy from "./components/createSubscription/Step0RenewalStrategy";
import Step1Configuration from "./components/createSubscription/Step1Configuration";
import Step2Schedule from "./components/createSubscription/Step2Schedule";
import Step5Billing from "./components/createSubscription/Step5Billing";
import { CartItem } from "./components/createSubscription/Step1Configuration";

const CreateSubscriptionPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Mode Selection
  const [subscriptionMode, setSubscriptionMode] = useState<"new" | "renew">("new");
  
  // Step 0: Renewal Strategy (only for renew mode)
  const [renewalStrategy, setRenewalStrategy] = useState<"extend" | "future">("extend");

  // Step 1
  const [selectedPlan, setSelectedPlan] = useState("lean_muscle");
  const [selectedVariant, setSelectedVariant] = useState("Standard");
  const [selectedCalories, setSelectedCalories] = useState("1800");
  const [proteinTarget, setProteinTarget] = useState(160);
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["Breakfast", "Lunch", "Dinner", "Post Workout"]);

  // Step 2
  const [duration, setDuration] = useState("1 Month");
  const [skipSaturdays, setSkipSaturdays] = useState(true);
  const [skipSundays, setSkipSundays] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().add(1, "day"));

  // Step 3 (not a step anymore, but state needed for addons)
  const [enableAddons, setEnableAddons] = useState(false);
  const [addonTab, setAddonTab] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Step 5 (now Billing & Review)
  const [promoCode, setPromoCode] = useState("");
  const [manualDiscount, setManualDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [customerEmail, setCustomerEmail] = useState("sarah.mansouri@email.com");
  const [paymentMessage, setPaymentMessage] = useState("");

  const steps = useMemo(() => {
    return subscriptionMode === "renew" 
      ? ["Renewal Options", "Configuration", "Schedule", "Billing & Review"]
      : ["Configuration", "Schedule", "Billing & Review"];
  }, [subscriptionMode]);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleModeSwitch = (mode: "new" | "renew") => {
    setSubscriptionMode(mode);
    setActiveStep(0); // Reset stepper on mode change
  };

  // Derivations for Summary
  const planTitles: Record<string, string> = {
    lean_muscle: "Lean Muscle",
    weight_loss: "Weight Loss",
    keto_balance: "Keto Balance"
  };
  const basePrices: Record<string, number> = {
    lean_muscle: 850,
    weight_loss: 750,
    keto_balance: 820
  };

  const planBasePrice = basePrices[selectedPlan] || 0;
  const addonsCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = planBasePrice + addonsCost;
  
  // Auto Amount Calculation: 10% loyalty discount for renewing!
  const renewalDiscount = subscriptionMode === "renew" ? subtotal * 0.10 : 0;
  
  const manualDisc = parseFloat(manualDiscount) || 0;
  const promoDisc = promoCode === "SUMMER20" ? 170 : 0;
  
  const discountAmount = manualDisc + promoDisc + renewalDiscount;
  const vat = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + vat;

  const renderActiveStepComponent = () => {
    const currentStepLabel = steps[activeStep];
    
    switch (currentStepLabel) {
      case "Renewal Options":
        return (
          <Step0RenewalStrategy 
            renewalStrategy={renewalStrategy}
            setRenewalStrategy={setRenewalStrategy}
            onNext={handleNext}
          />
        );
      case "Configuration":
        return (
          <Step1Configuration
            subscriptionMode={subscriptionMode}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            selectedCalories={selectedCalories}
            setSelectedCalories={setSelectedCalories}
            proteinTarget={proteinTarget}
            setProteinTarget={setProteinTarget}
            selectedMeals={selectedMeals}
            setSelectedMeals={setSelectedMeals}
            enableAddons={enableAddons}
            setEnableAddons={setEnableAddons}
            addonTab={addonTab}
            setAddonTab={setAddonTab}
            cart={cart}
            setCart={setCart}
            onBack={activeStep > 0 ? handleBack : undefined}
            onNext={handleNext}
          />
        );
      case "Schedule":
        return (
          <Step2Schedule
            subscriptionMode={subscriptionMode}
            duration={duration}
            setDuration={setDuration}
            skipSaturdays={skipSaturdays}
            setSkipSaturdays={setSkipSaturdays}
            skipSundays={skipSundays}
            setSkipSundays={setSkipSundays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            manualDiscount={manualDiscount}
            setManualDiscount={setManualDiscount}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case "Billing & Review":
        return (
          <Step5Billing
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            paymentMessage={paymentMessage}
            setPaymentMessage={setPaymentMessage}
            planName={planTitles[selectedPlan] || "Custom Plan"}
            duration={duration}
            mealsPerDay={selectedMeals.length}
            deliveryAddress={"Home - 123 Palm Jumeirah"}
            planBasePrice={planBasePrice}
            addonsCost={addonsCost}
            subtotal={subtotal}
            discountAmount={discountAmount}
            vat={vat}
            total={total}
            cart={cart}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
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
        <Grid item xs={12} md={6}>
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
    </Box>
  );
};

export default CreateSubscriptionPage;

import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  TextField,
  InputAdornment,
  alpha,
  Divider,
  CircularProgress,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import dayjs from "dayjs";
import {
  ISubscriptionWizardPreview,
  SubscriptionWizardPaymentProvider,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import { mapSubscriptionTypeToDuration } from "../../subscriptionWizardSchedule";
import { CartItem } from "./Step1Configuration";

const paymentProviderOptions: {
  value: SubscriptionWizardPaymentProvider;
  title: string;
  description: string;
}[] = [
  {
    value: "Stripe",
    title: "Stripe",
    description: "Card payment via a secure Stripe payment link.",
  },
  {
    value: "Tamara",
    title: "Tamara",
    description: "Buy now, pay later via Tamara payment link.",
  },
];

type Props = {
  preview: ISubscriptionWizardPreview | null;
  isPreviewLoading?: boolean;
  cart?: CartItem[];
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  paymentMessage: string;
  setPaymentMessage: (val: string) => void;
  paymentProvider: SubscriptionWizardPaymentProvider;
  setPaymentProvider: (val: SubscriptionWizardPaymentProvider) => void;
  onBack: () => void;
  onSaveDraft: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
  isSavingDraft?: boolean;
  isSaving?: boolean;
};

const formatPreviewDate = (value?: string | null) =>
  value ? dayjs(value).format("MMM D, YYYY") : "—";

const Step5Billing = (props: Props) => {
  const preview = props.preview;
  const planDurationLabel = preview
    ? mapSubscriptionTypeToDuration(preview.planDuration)
    : "—";

  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>
        Review & Finalize
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          Review the subscription details and select a payment method.
        </Typography>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 3 }}>
            Subscription Summary
          </Typography>

          {props.isPreviewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={36} />
            </Box>
          ) : !preview ? (
            <Typography sx={{ fontSize: 14, color: "text.secondary", py: 4, textAlign: "center" }}>
              Unable to load subscription preview.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Plan Selected
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {preview.planName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Plan Duration
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {planDurationLabel}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Meals per Day
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {preview.mealsPerDay} Meals
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Average Calories
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {preview.averageCalories} kcal
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Start Date
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {formatPreviewDate(preview.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      End Date
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {formatPreviewDate(preview.endDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                      Delivery Address
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                      {preview.deliveryAddress || "—"}
                    </Typography>
                  </Grid>
                </Grid>

                {props.cart && props.cart.length > 0 ? (
                  <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #E2E8F0" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 2 }}>
                      Additional Items
                    </Typography>
                    <Stack spacing={1.5}>
                      {props.cart.map((item) => (
                        <Box
                          key={item.id}
                          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                            {item.quantity}x {item.name}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                            {(item.price * item.quantity).toFixed(2)} AED
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Plan Amount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                        {preview.planAmount.toFixed(2)} AED
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Add-on Amount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                        {preview.addOnAmount.toFixed(2)} AED
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "error.main" }}>Discount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "error.main" }}>
                        -{preview.discountAmount.toFixed(2)} AED
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>VAT (5%)</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                        {preview.vatAmount.toFixed(2)} AED
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Total</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 900, color: "primary.main" }}>
                      {preview.total.toFixed(2)}{" "}
                      <Typography component="span" sx={{ fontSize: 14, fontWeight: 700 }}>
                        AED
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 3 }}>
            Payment Configuration
          </Typography>

          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 3 }}>
            Payment Provider
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {paymentProviderOptions.map((option) => {
              const isSelected = props.paymentProvider === option.value;

              return (
                <Grid item xs={12} md={6} key={option.value}>
                  <Box
                    onClick={() => props.setPaymentProvider(option.value)}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: isSelected ? "primary.main" : "#E2E8F0",
                      bgcolor: isSelected ? alpha("#10B981", 0.04) : "#fff",
                      display: "flex",
                      alignItems: "flex-start",
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        color: isSelected ? "primary.main" : "text.secondary",
                        mr: 2,
                        mt: 0.25,
                      }}
                    >
                      <CreditCardIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: isSelected ? "primary.main" : "#0F172A",
                          mb: 0.5,
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.4 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A", mb: 3 }}>
              Payment Link Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", mb: 1 }}>
                  Customer Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="customer@email.com"
                  value={props.customerEmail}
                  onChange={(e) => props.setCustomerEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon sx={{ color: "text.disabled" }} />
                      </InputAdornment>
                    ),
                    sx: { bgcolor: "#fff", borderRadius: 2 },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", mb: 1 }}>
                  Optional Message
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Add a personalized note..."
                  value={props.paymentMessage}
                  onChange={(e) => props.setPaymentMessage(e.target.value)}
                  InputProps={{ sx: { bgcolor: "#fff", borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="outlined"
          size="large"
          onClick={props.onBack}
          disabled={props.isSaving || props.isSavingDraft}
          sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}
        >
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={props.onSaveDraft}
            disabled={props.isSaving || props.isSavingDraft}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              color: "#0F172A",
              borderColor: "#E2E8F0",
              fontWeight: 700,
              bgcolor: "#fff",
              minWidth: 130,
              "&:hover": { bgcolor: "#F8FAFC" },
            }}
          >
            {props.isSavingDraft ? <CircularProgress size={22} /> : "Save Draft"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={props.onSubmit}
            disabled={
              props.isSaving ||
              props.isSavingDraft ||
              props.isPreviewLoading ||
              !preview ||
              !props.customerEmail
            }
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              minWidth: 220,
              boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
            }}
          >
            {props.isSaving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Create & Send Payment Link"
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Step5Billing;

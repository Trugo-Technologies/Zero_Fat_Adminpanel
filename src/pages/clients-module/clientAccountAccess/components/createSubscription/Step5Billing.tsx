import { Box, Typography, Stack, Button, Grid, TextField, InputAdornment, FormControl, RadioGroup, Radio, FormControlLabel, alpha, Divider } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { CartItem } from "./Step1Configuration";

type Props = {
  cart?: CartItem[];
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  paymentMessage: string;
  setPaymentMessage: (val: string) => void;
  planName: string;
  duration: string;
  mealsPerDay: number;
  deliveryAddress: string;
  planBasePrice: number;
  addonsCost: number;
  subtotal: number;
  discountAmount: number;
  vat: number;
  total: number;
  onBack: () => void;
};

const Step5Billing = (props: Props) => {
  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>Review & Finalize</Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          Review the subscription details and select a payment method.
        </Typography>
      </Box>

      <Box sx={{ mb: 5 }}>
          {/* Subscription Summary Section */}
          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 4 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 3 }}>Subscription Summary</Typography>
            
            <Grid container spacing={4}>
              {/* Left side: Plan details */}
              <Grid item xs={12} md={7}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>Plan Selected</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{props.planName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>Plan Duration</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{props.duration}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>Meals per Day</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{props.mealsPerDay} Meals</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>Delivery Address</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{props.deliveryAddress}</Typography>
                  </Grid>
                </Grid>

                {props.cart && props.cart.length > 0 && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #E2E8F0" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 2 }}>Additional Items</Typography>
                    <Stack spacing={1.5}>
                      {props.cart.map(item => (
                        <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{item.quantity}x {item.name}</Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{(item.price * item.quantity).toFixed(2)} AED</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Right side: Amount Details */}
              <Grid item xs={12} md={5}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Plan Amount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{props.planBasePrice.toFixed(2)} AED</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Add-on Amount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{props.addonsCost.toFixed(2)} AED</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "error.main" }}>Discount</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "error.main" }}>-{props.discountAmount.toFixed(2)} AED</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>VAT (5%)</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{props.vat.toFixed(2)} AED</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Total</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 900, color: "primary.main" }}>{props.total.toFixed(2)} <Typography component="span" sx={{ fontSize: 14, fontWeight: 700 }}>AED</Typography></Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Payment Method Section */}
          <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 3 }}>Payment Configuration</Typography>
            
            <Box
              sx={{
                p: 3,
                mb: 5,
                borderRadius: 3,
                border: "2px solid",
                borderColor: "primary.main",
                bgcolor: alpha("#10B981", 0.04),
                display: "flex",
                alignItems: "center"
              }}
            >
                <Box sx={{ color: "primary.main", mr: 3 }}>
                  <CreditCardIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: "primary.main", mb: 0.5 }}>Online Payment</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.4 }}>A secure payment link will be automatically generated and sent to the customer.</Typography>
                </Box>
            </Box>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A", mb: 3 }}>Payment Link Details</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", mb: 1 }}>Customer Email</Typography>
                    <TextField 
                      fullWidth 
                      placeholder="customer@email.com" 
                      value={props.customerEmail}
                      onChange={(e) => props.setCustomerEmail(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><MailOutlineIcon sx={{ color: "text.disabled" }} /></InputAdornment>,
                        sx: { bgcolor: "#fff", borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", mb: 1 }}>Optional Message</Typography>
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
        <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" sx={{ px: 4, py: 1.5, borderRadius: 2, color: "#0F172A", borderColor: "#E2E8F0", fontWeight: 700, bgcolor: "#fff", "&:hover": { bgcolor: "#F8FAFC" } }}>
            Save Draft
          </Button>
          <Button variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
            Create & Send Payment Link
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Step5Billing;

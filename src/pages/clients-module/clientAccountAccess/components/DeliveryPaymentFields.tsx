import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { DeliveryCalendarPaymentProvider } from "src/types/modules/clientsManagement/clientAccountAccess";

export const PAYMENT_PROVIDER_OPTIONS: {
  value: DeliveryCalendarPaymentProvider;
  label: string;
}[] = [
  { value: "Stripe", label: "Stripe" },
  { value: "Tamara", label: "Tamara" },
];

type Props = {
  paymentProvider: DeliveryCalendarPaymentProvider;
  onPaymentProviderChange: (value: DeliveryCalendarPaymentProvider) => void;
  waivePayment: boolean;
  onWaivePaymentChange: (value: boolean) => void;
  disabled?: boolean;
};

const DeliveryPaymentFields = ({
  paymentProvider,
  onPaymentProviderChange,
  waivePayment,
  onWaivePaymentChange,
  disabled = false,
}: Props) => (
  <Stack spacing={2} sx={{ mt: 2 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48" }}>
      Payment
    </Typography>
    <FormControl fullWidth size="small" disabled={disabled || waivePayment}>
      <InputLabel>Payment Provider</InputLabel>
      <Select
        value={paymentProvider}
        label="Payment Provider"
        onChange={(e) =>
          onPaymentProviderChange(e.target.value as DeliveryCalendarPaymentProvider)
        }
      >
        {PAYMENT_PROVIDER_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControlLabel
      control={
        <Switch
          checked={waivePayment}
          onChange={(e) => onWaivePaymentChange(e.target.checked)}
          disabled={disabled}
        />
      }
      label="Waive payment"
    />
  </Stack>
);

export default DeliveryPaymentFields;

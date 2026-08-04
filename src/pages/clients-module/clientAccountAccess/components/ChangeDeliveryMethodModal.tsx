import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  alpha,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useTheme } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { DeliveryDay } from "../types";

const ONLINE_PAYMENT_METHOD = "online";

type Props = {
  open: boolean;
  clientId?: string | null;
  delivery: DeliveryDay | null;
  onClose: () => void;
  onSave: (method: string) => void | Promise<void>;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const ChangeDeliveryMethodModal = ({
  open,
  clientId,
  delivery,
  onClose,
  onSave,
  isSaving = false,
  errorMessage = null,
}: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();

  const handleSave = async () => {
    if (!delivery) return;
    await onSave(ONLINE_PAYMENT_METHOD);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px -12px rgba(15, 23, 42, 0.25)",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PaymentIcon sx={{ color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1A2B48", letterSpacing: "-0.01em" }}>
            Change Payment Method
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", "&:hover": { bgcolor: "#F1F5F9" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        ) : null}
        {delivery ? (
          <>
            <Typography sx={{ fontSize: 15, color: "text.secondary", mb: 3 }}>
              Selected Day: <strong>{dayjs(delivery.date).format("MMM D, YYYY")}</strong>
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>
                <IntlMessages id="payments.paymentMethod" />
              </InputLabel>
              <Select
                value={ONLINE_PAYMENT_METHOD}
                label={messages["payments.paymentMethod"] as string}
              >
                <MenuItem value={ONLINE_PAYMENT_METHOD}>
                  <IntlMessages id="clientAccountAccess.deliveryMethod.online" />
                </MenuItem>
              </Select>
            </FormControl>
          </>
        ) : (
          <Typography sx={{ color: "text.secondary" }}>
            No delivery selected.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", bgcolor: "#F8FAFC" }}>
        <Button onClick={onClose} disabled={isSaving} sx={{ color: "text.secondary", fontWeight: 600, px: 3 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          disabled={!delivery || isSaving}
          onClick={handleSave}
          sx={{
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 4,
            borderRadius: "10px",
            minWidth: 100,
          }}
        >
          {isSaving ? <CircularProgress size={22} color="inherit" /> : (messages["common.save"] as string)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeDeliveryMethodModal;

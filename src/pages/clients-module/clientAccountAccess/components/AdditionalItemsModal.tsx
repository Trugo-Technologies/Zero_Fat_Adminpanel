import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  DeliveryCalendarAddOnCategory,
  DeliveryCalendarPaymentProvider,
  IAddDeliveryCalendarItemsPayload,
  IDeliveryCalendarActionPreview,
} from "src/types/modules/clientsManagement/clientAccountAccess";
import {
  useAddDeliveryCalendarItemsMutation,
  useGetDeliveryCalendarAddOnOptionsQuery,
  usePreviewAddDeliveryCalendarItemsMutation,
} from "../services/api";
import { getApiErrorMessage } from "src/Helpers/get-api-error-message";
import { showErrorToasts } from "src/Components/toasts";
import {
  DeliveryActionScopeOption,
  deliveryActionScopeToApi,
} from "../deliveryCalendarActions";
import AdditionalItemsPreviewResult from "./AdditionalItemsPreviewResult";
import DeliveryPaymentFields from "./DeliveryPaymentFields";

const ADD_ON_CATEGORIES: DeliveryCalendarAddOnCategory[] = [
  "Meals",
  "Snacks",
  "Drinks",
  "Supplements",
];

const SCOPE_OPTIONS: { value: "thisDay" | "upcoming"; labelKey: string }[] = [
  { value: "thisDay", labelKey: "clientAccountAccess.scope.thisDay" },
  { value: "upcoming", labelKey: "clientAccountAccess.scope.upcoming" },
];

type CartItem = {
  mealId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  open: boolean;
  clientId?: string | null;
  date?: string | null;
  bypassCutoffEnabled?: boolean;
  onClose: () => void;
  onSaved?: () => void;
  errorMessage?: string | null;
};

const AdditionalItemsModal = ({
  open,
  clientId,
  date,
  bypassCutoffEnabled = false,
  onClose,
  onSaved,
  errorMessage = null,
}: Props) => {
  const { messages, locale } = useIntl();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [scope, setScope] = useState<"thisDay" | "upcoming">("thisDay");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentProvider, setPaymentProvider] =
    useState<DeliveryCalendarPaymentProvider>("Stripe");
  const [waivePayment, setWaivePayment] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [preview, setPreview] = useState<IDeliveryCalendarActionPreview | null>(null);

  const [previewAddItems, { isLoading: isPreviewing }] =
    usePreviewAddDeliveryCalendarItemsMutation();
  const [addItems, { isLoading: isSaving }] = useAddDeliveryCalendarItemsMutation();

  const isSubmitting = isPreviewing || isSaving;
  const category = ADD_ON_CATEGORIES[tab];

  const { data: addOnOptionsResponse, isFetching: isOptionsLoading } =
    useGetDeliveryCalendarAddOnOptionsQuery(
      { clientId: clientId || "", category },
      { skip: !open || !clientId }
    );

  const addOnOptions = addOnOptionsResponse?.data ?? [];

  const getItemLabel = (nameEn: string, nameAr: string) =>
    locale === "ar-SA" ? nameAr || nameEn : nameEn || nameAr;

  useEffect(() => {
    if (!open) {
      setTab(0);
      setScope("thisDay");
      setSelectedItemId("");
      setQuantity(1);
      setCart([]);
      setPaymentProvider("Stripe");
      setWaivePayment(false);
      setSaveError(null);
      setPreview(null);
    }
  }, [open]);

  useEffect(() => {
    setSelectedItemId("");
    setQuantity(1);
  }, [category]);

  useEffect(() => {
    if (!preview) {
      setSaveError(null);
    }
  }, [cart, preview, scope]);

  const selectedItem = addOnOptions.find((item) => item.id === selectedItemId);

  const handleAddToCart = () => {
    if (!selectedItemId || !selectedItem) return;

    const existingItemIndex = cart.findIndex((item) => item.mealId === selectedItemId);
    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          mealId: selectedItemId,
          name: getItemLabel(selectedItem.nameEn, selectedItem.nameAr),
          quantity,
          unitPrice: selectedItem.unitPrice,
        },
      ]);
    }
    setSelectedItemId("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (mealId: string) => {
    setCart(cart.filter((item) => item.mealId !== mealId));
  };

  const buildAddItemsPayload = (): IAddDeliveryCalendarItemsPayload | null => {
    if (!clientId || !date) return null;

    const payload: IAddDeliveryCalendarItemsPayload = {
      clientId,
      date,
      scope: deliveryActionScopeToApi(scope as DeliveryActionScopeOption),
      items: cart.map((item) => ({
        mealId: item.mealId,
        quantity: item.quantity,
      })),
      waivePayment,
    };

    if (bypassCutoffEnabled) {
      payload.bypassCutoff = true;
    }

    if (!waivePayment) {
      payload.paymentProvider = paymentProvider;
    }

    return payload;
  };

  const handleSave = async () => {
    if (!clientId || !date || cart.length === 0) {
      setSaveError(
        !clientId || !date
          ? "Select a client and delivery date before saving."
          : "Add at least one item before saving."
      );
      return;
    }

    const addItemsPayload = buildAddItemsPayload();
    if (!addItemsPayload) return;

    setSaveError(null);

    try {
      const previewResult = await previewAddItems({
        clientId,
        data: {
          clientId,
          date,
          scope: addItemsPayload.scope,
          items: addItemsPayload.items,
          ...(bypassCutoffEnabled ? { bypassCutoff: true } : {}),
        },
      }).unwrap();

      const previewData = previewResult?.data ?? null;
      setPreview(previewData);

      await addItems({
        clientId,
        data: addItemsPayload,
      }).unwrap();

      onSaved?.();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSaveError(message);
      showErrorToasts(message);
    }
  };

  const displayError = saveError || errorMessage;
  const cartTotal = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const showSuccessView = Boolean(preview);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: 22 }}>
        {messages["clientAccountAccess.additionalItems"] as string}
      </DialogTitle>
      <DialogContent>
        {displayError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        ) : null}

        {showSuccessView && preview ? (
          <AdditionalItemsPreviewResult preview={preview} />
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 1.5 }}>
                {messages["clientAccountAccess.applyOptions"] as string}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={scope}
                  onChange={(e) =>
                    setScope(e.target.value as "thisDay" | "upcoming")
                  }
                >
                  <Stack spacing={1}>
                    {SCOPE_OPTIONS.map((opt) => (
                      <Box
                        key={opt.value}
                        onClick={() => setScope(opt.value)}
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor:
                            scope === opt.value ? "primary.main" : "#E2E8F0",
                          bgcolor:
                            scope === opt.value
                              ? alpha(theme.palette.primary.main, 0.04)
                              : "#F8FAFC",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor:
                              scope === opt.value ? "primary.main" : "#CBD5E1",
                          },
                        }}
                      >
                        <FormControlLabel
                          value={opt.value}
                          control={<Radio size="small" />}
                          label={
                            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                              {messages[opt.labelKey] as string}
                            </Typography>
                          }
                          sx={{ m: 0 }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Box>

            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              sx={{ mb: 2 }}
            >
              {ADD_ON_CATEGORIES.map((cat) => (
                <Tab
                  key={cat}
                  label={
                    messages[
                      `clientAccountAccess.category.${cat.toLowerCase()}` as keyof typeof messages
                    ] as string
                  }
                />
              ))}
            </Tabs>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth size="small" disabled={isOptionsLoading || !clientId}>
                <InputLabel>{messages["clientAccountAccess.selectItem"] as string}</InputLabel>
                <Select
                  value={selectedItemId}
                  label={messages["clientAccountAccess.selectItem"] as string}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  {addOnOptions.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {getItemLabel(item.nameEn, item.nameAr)} — AED {item.unitPrice.toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                  px: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !selectedItemId}
                >
                  <RemoveIcon fontSize="small" color="primary" />
                </IconButton>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ minWidth: 24, textAlign: "center" }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!selectedItemId}
                >
                  <AddIcon fontSize="small" color="primary" />
                </IconButton>
              </Stack>
            </Stack>

            {!clientId ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select a client to load add-on options.
              </Typography>
            ) : null}

            {clientId && !isOptionsLoading && addOnOptions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No items available in this category.
              </Typography>
            ) : null}

            <Button
              variant="outlined"
              fullWidth
              disabled={!selectedItemId || isOptionsLoading}
              onClick={handleAddToCart}
              sx={{ mb: 3 }}
            >
              Add to List
            </Button>

            {cart.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 14 }}>
                  Items Added
                </Typography>
                <List sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 0 }}>
                  {cart.map((item, index) => (
                    <Box key={item.mealId}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}
                            >
                              {item.name}
                            </Typography>
                          }
                          secondary={`AED ${item.unitPrice.toFixed(2)} x ${item.quantity}`}
                          secondaryTypographyProps={{ fontSize: 13 }}
                        />
                        <ListItemSecondaryAction>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                              display: "inline-block",
                              mr: 2,
                            }}
                          >
                            AED {(item.unitPrice * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFromCart(item.mealId)}
                          >
                            <DeleteOutlineIcon fontSize="small" color="error" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Box>
            )}

            {cart.length > 0 && !preview ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 500 }}>
                  Estimated Total
                </Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
                  AED {cartTotal.toFixed(2)}
                </Typography>
              </Box>
            ) : null}

            <DeliveryPaymentFields
              paymentProvider={paymentProvider}
              onPaymentProviderChange={setPaymentProvider}
              waivePayment={waivePayment}
              onWaivePaymentChange={setWaivePayment}
              disabled={isSubmitting}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: 2 }}>
          {messages["common.cancel"] as string}
        </Button>
        {!showSuccessView ? (
          <Button
            variant="contained"
            type="button"
            onClick={handleSave}
            disabled={cart.length === 0 || isSubmitting || !clientId || !date}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              (messages["common.save"] as string)
            )}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalItemsModal;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  alpha,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Checkbox, FormGroup } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  DeliveryCancelScopeOption,
  deliveryCancelScopeToApi,
} from "../deliveryCalendarActions";
import { useGetDeliveryCalendarDayQuery } from "../services/api";

type Props = {
  open: boolean;
  clientId?: string | null;
  date?: string | null;
  onClose: () => void;
  onSave: (
    scope: DeliveryCancelScopeOption,
    mealTypeIds: string[]
  ) => void | Promise<void>;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const scopeOptions: { value: DeliveryCancelScopeOption; label: string }[] = [
  { value: "thisDay", label: "This Day Only" },
  { value: "upcoming", label: "All Upcoming Days" },
  { value: "entireOrder", label: "Entire Order" },
  { value: "mealPlanOnly", label: "Specific Meal Only" },
];

const CancelDeliveryModal = ({
  open,
  clientId,
  date,
  onClose,
  onSave,
  isSaving = false,
  errorMessage = null,
}: Props) => {
  const { messages } = useIntl();
  const [scope, setScope] = useState<DeliveryCancelScopeOption>("thisDay");
  const [selectedMealTypeIds, setSelectedMealTypeIds] = useState<string[]>([]);

  const { data: dayDetailResponse } = useGetDeliveryCalendarDayQuery(
    { clientId: clientId || "", date: date || "" },
    { skip: !open || !clientId || !date }
  );

  const mealOptions = useMemo(() => {
    const meals = dayDetailResponse?.data?.meals ?? [];
    const uniqueMeals = new Map<string, string>();

    meals.forEach((meal) => {
      if (!uniqueMeals.has(meal.mealTypeId)) {
        uniqueMeals.set(meal.mealTypeId, meal.mealTypeName);
      }
    });

    return Array.from(uniqueMeals.entries()).map(([mealTypeId, mealTypeName]) => ({
      mealTypeId,
      mealTypeName,
    }));
  }, [dayDetailResponse?.data?.meals]);

  useEffect(() => {
    if (!open) {
      setScope("thisDay");
      setSelectedMealTypeIds([]);
    }
  }, [open]);

  const handleMealToggle = (mealTypeId: string) => {
    setSelectedMealTypeIds((prev) =>
      prev.includes(mealTypeId)
        ? prev.filter((id) => id !== mealTypeId)
        : [...prev, mealTypeId]
    );
  };

  const handleSave = async () => {
    await onSave(scope, selectedMealTypeIds);
  };

  const isSaveDisabled =
    isSaving ||
    (scope === "mealPlanOnly" && selectedMealTypeIds.length === 0);

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
              bgcolor: alpha("#EF4444", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BlockIcon sx={{ color: "#EF4444" }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1A2B48", letterSpacing: "-0.01em" }}>
            <IntlMessages id="clientAccountAccess.cancelDelivery" />
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
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 2 }}>
          Select the scope of the cancellation:
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={scope} onChange={(e) => setScope(e.target.value as DeliveryCancelScopeOption)}>
            <Stack spacing={1.5}>
              {scopeOptions.map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => setScope(opt.value)}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: scope === opt.value ? "primary.main" : "#E2E8F0",
                    bgcolor: scope === opt.value ? alpha("#10B981", 0.04) : "#F8FAFC",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: scope === opt.value ? "primary.main" : "#CBD5E1" }
                  }}
                >
                  <FormControlLabel
                    value={opt.value}
                    control={<Radio size="small" sx={{ color: scope === opt.value ? "primary.main" : "text.secondary", "&.Mui-checked": { color: "primary.main" } }} />}
                    label={<Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>{opt.label}</Typography>}
                    sx={{ m: 0 }}
                  />
                  {scope === "mealPlanOnly" && opt.value === "mealPlanOnly" && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1 }}>
                        Select meals to cancel:
                      </Typography>
                      {mealOptions.length > 0 ? (
                        <FormGroup row>
                          {mealOptions.map((meal) => (
                            <FormControlLabel
                              key={meal.mealTypeId}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedMealTypeIds.includes(meal.mealTypeId)}
                                  onChange={() => handleMealToggle(meal.mealTypeId)}
                                  sx={{ "&.Mui-checked": { color: "primary.main" } }}
                                />
                              }
                              label={<Typography sx={{ fontSize: 13 }}>{meal.mealTypeName}</Typography>}
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                          No meals available for this day.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", bgcolor: "#F8FAFC" }}>
        <Button onClick={onClose} disabled={isSaving} sx={{ color: "text.secondary", fontWeight: 600, px: 3 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
          sx={{
            bgcolor: "#EF4444",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 4,
            borderRadius: "10px",
            minWidth: 160,
            "&:hover": { bgcolor: "#DC2626" },
          }}
        >
          {isSaving ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Confirm Cancellation"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDeliveryModal;

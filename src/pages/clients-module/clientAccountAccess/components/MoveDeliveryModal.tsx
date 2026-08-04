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
import EventIcon from "@mui/icons-material/Event";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Checkbox, FormGroup } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { DeliveryActionScopeOption } from "../deliveryCalendarActions";
import { useGetDeliveryCalendarDayQuery } from "../services/api";

export type MoveDeliverySavePayload =
  | {
      kind: "move";
      scope: DeliveryActionScopeOption;
      newDeliveryDate: string;
      mealTypeIds: string[];
      bypassResumeWindow: boolean;
    }
  | {
      kind: "pause";
      pauseDate: string;
    };

type Props = {
  open: boolean;
  clientId?: string | null;
  date?: string | null;
  onClose: () => void;
  onSave: (payload: MoveDeliverySavePayload) => void | Promise<void>;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const scopeOptions: { value: DeliveryActionScopeOption; label: string }[] = [
  { value: "thisDay", label: "This Day Only" },
  { value: "upcoming", label: "All Upcoming Days" },
  { value: "mealPlanOnly", label: "Specific Meal Only" },
];

const MoveDeliveryModal = ({
  open,
  clientId,
  date,
  onClose,
  onSave,
  isSaving = false,
  errorMessage = null,
}: Props) => {
  const { messages } = useIntl();
  const [scope, setScope] = useState<DeliveryActionScopeOption>("thisDay");
  const [newDate, setNewDate] = useState<Dayjs | null>(dayjs().add(1, "day"));
  const [selectedMealTypeIds, setSelectedMealTypeIds] = useState<string[]>([]);
  const [pauseDate, setPauseDate] = useState<Dayjs | null>(null);
  const [bypassResumeWindow, setBypassResumeWindow] = useState(false);

  const isPauseFlow = scope === "upcoming";

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
      setNewDate(dayjs().add(1, "day"));
      setSelectedMealTypeIds([]);
      setPauseDate(null);
      setBypassResumeWindow(false);
      return;
    }

    setPauseDate(date ? dayjs(date) : dayjs());
  }, [open, date]);

  const handleMealToggle = (mealTypeId: string) => {
    setSelectedMealTypeIds((prev) =>
      prev.includes(mealTypeId)
        ? prev.filter((id) => id !== mealTypeId)
        : [...prev, mealTypeId]
    );
  };

  const handleSave = async () => {
    if (isPauseFlow) {
      if (!pauseDate) return;
      await onSave({
        kind: "pause",
        pauseDate: pauseDate.format("YYYY-MM-DD"),
      });
      return;
    }

    if (!newDate) return;
    await onSave({
      kind: "move",
      scope,
      newDeliveryDate: newDate.format("YYYY-MM-DD"),
      mealTypeIds: selectedMealTypeIds,
      bypassResumeWindow,
    });
  };

  const isSaveDisabled =
    isSaving ||
    (isPauseFlow
      ? !pauseDate
      : !newDate ||
        (scope === "mealPlanOnly" && selectedMealTypeIds.length === 0));

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
              bgcolor: alpha("#10B981", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EventIcon sx={{ color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1A2B48", letterSpacing: "-0.01em" }}>
            <IntlMessages id="clientAccountAccess.moveDelivery" />
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
          Select the scope for moving the delivery:
        </Typography>
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <RadioGroup value={scope} onChange={(e) => setScope(e.target.value as DeliveryActionScopeOption)}>
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
                    "&:hover": { borderColor: scope === opt.value ? "primary.main" : "#CBD5E1" },
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
                        Select meals to move:
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

        {isPauseFlow ? (
          <>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 2 }}>
              Select the pause date:
            </Typography>
            <DatePicker
              label="Pause Date"
              value={pauseDate}
              onChange={setPauseDate}
              minDate={dayjs()}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>
              All upcoming deliveries will be paused from this date. Use the
              Resume Delivery action on the calendar to schedule when
              deliveries start again.
            </Typography>
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 2 }}>
              Select the new delivery date:
            </Typography>
            <DatePicker
              label={messages["clientAccountAccess.newDeliveryDate"] as string}
              value={newDate}
              onChange={setNewDate}
              minDate={dayjs()}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </>
        )}

        {!isPauseFlow ? (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            bgcolor: "#F8FAFC",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={bypassResumeWindow}
                onChange={(e) => setBypassResumeWindow(e.target.checked)}
                sx={{ "&.Mui-checked": { color: "primary.main" } }}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>
                  Bypass resume window
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Skip validation so the delivery can be moved without restrictions.
                </Typography>
              </Box>
            }
            sx={{ m: 0, alignItems: "flex-start" }}
          />
        </Box>
        ) : null}
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
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 4,
            borderRadius: "10px",
            minWidth: 140,
          }}
        >
          {isSaving ? (
            <CircularProgress size={22} color="inherit" />
          ) : isPauseFlow ? (
            "Pause Deliveries"
          ) : (
            "Confirm Move"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveDeliveryModal;

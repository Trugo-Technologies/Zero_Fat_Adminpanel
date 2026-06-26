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
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Checkbox, FormGroup } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type ScopeOption = "thisDay" | "upcoming" | "entireOrder" | "mealPlanOnly";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (scope: ScopeOption, selectedMeals: string[]) => void;
};

const scopeOptions: { value: ScopeOption; label: string }[] = [
  { value: "thisDay", label: "This Day Only" },
  { value: "upcoming", label: "All Upcoming Days" },
  { value: "entireOrder", label: "Entire Order" },
  { value: "mealPlanOnly", label: "Specific Meal Only" },
];

const CancelDeliveryModal = ({ open, onClose, onSave }: Props) => {
  const { messages } = useIntl();
  const [scope, setScope] = useState<ScopeOption>("thisDay");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);

  const handleMealToggle = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
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
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 2 }}>
          Select the scope of the cancellation:
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={scope} onChange={(e) => setScope(e.target.value as ScopeOption)}>
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
                      <FormGroup row>
                        {["Breakfast", "Lunch", "Dinner", "Post Workout"].map((meal) => (
                          <FormControlLabel
                            key={meal}
                            control={
                              <Checkbox
                                size="small"
                                checked={selectedMeals.includes(meal)}
                                onChange={() => handleMealToggle(meal)}
                                sx={{ "&.Mui-checked": { color: "primary.main" } }}
                              />
                            }
                            label={<Typography sx={{ fontSize: 13 }}>{meal}</Typography>}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", bgcolor: "#F8FAFC" }}>
        <Button onClick={onClose} sx={{ color: "text.secondary", fontWeight: 600, px: 3 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(scope, selectedMeals);
            onClose();
          }}
          disabled={scope === "mealPlanOnly" && selectedMeals.length === 0}
          sx={{
            bgcolor: "#EF4444",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 4,
            borderRadius: "10px",
            "&:hover": { bgcolor: "#DC2626" },
          }}
        >
          Confirm Cancellation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDeliveryModal;

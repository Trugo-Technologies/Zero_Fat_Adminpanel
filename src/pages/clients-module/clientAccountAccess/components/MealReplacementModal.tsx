/** @format */

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { dishOptions, mockMealSlots } from "../mockData";
import { MealSlot } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

const MealReplacementModal = ({ open, onClose, onSave }: Props) => {
  const { messages } = useIntl();
  const [slots, setSlots] = useState<MealSlot[]>(mockMealSlots);
  const [replacingSlot, setReplacingSlot] = useState<string | null>(null);
  const [replacement, setReplacement] = useState("");

  const handleReplace = (slotName: string) => {
    if (!replacement) return;
    setSlots((prev) =>
      prev.map((s) =>
        s.slot === slotName ? { ...s, currentMeal: replacement } : s
      )
    );
    setReplacingSlot(null);
    setReplacement("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {messages["clientAccountAccess.replaceMeals"] as string}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {slots.map((slot) => (
            <Box
              key={slot.slot}
              sx={{
                p: 2,
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: "background.default",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {slot.slot}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {slot.currentMeal}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<SwapHorizIcon />}
                  onClick={() => setReplacingSlot(slot.slot)}
                  sx={{ borderRadius: 2 }}
                >
                  {messages["clientAccountAccess.replace"] as string}
                </Button>
              </Stack>

              {replacingSlot === slot.slot && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>
                      {messages["clientAccountAccess.searchDish"] as string}
                    </InputLabel>
                    <Select
                      value={replacement}
                      label={messages["clientAccountAccess.searchDish"] as string}
                      onChange={(e) => setReplacement(e.target.value)}
                    >
                      {dishOptions.map((dish) => (
                        <MenuItem key={dish} value={dish}>
                          {dish}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={() => handleReplace(slot.slot)}
                    disabled={!replacement}
                    sx={{ borderRadius: 2, minWidth: 100 }}
                  >
                    {messages["common.save"] as string}
                  </Button>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button variant="contained" onClick={() => { onSave(); onClose(); }} sx={{ borderRadius: 2 }}>
          {messages["common.save"] as string}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealReplacementModal;

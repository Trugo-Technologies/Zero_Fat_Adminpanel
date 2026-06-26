/** @format */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
};

const ChangeMealPlanModal = ({ open, onClose, onApply }: Props) => {
  const { messages } = useIntl();
  const [calories, setCalories] = useState("1800");
  const [variant, setVariant] = useState("lean");
  const [mealsPerDay, setMealsPerDay] = useState("4");
  const [breakfast, setBreakfast] = useState(true);
  const [lunch, setLunch] = useState(true);
  const [dinner, setDinner] = useState(true);
  const [postWorkout, setPostWorkout] = useState(true);
  const [applyScope, setApplyScope] = useState("thisDay");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {messages["clientAccountAccess.changeMealPlan"] as string}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>
                {messages["clientAccountAccess.calories"] as string}
              </InputLabel>
              <Select
                value={calories}
                label={messages["clientAccountAccess.calories"] as string}
                onChange={(e) => setCalories(e.target.value)}
              >
                {["1400", "1600", "1800", "2000", "2200"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c} kcal
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>
                {messages["clientAccountAccess.variant"] as string}
              </InputLabel>
              <Select
                value={variant}
                label={messages["clientAccountAccess.variant"] as string}
                onChange={(e) => setVariant(e.target.value)}
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="lean">Lean Muscle</MenuItem>
                <MenuItem value="keto">Keto</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>
                {messages["clientAccountAccess.summary.mealsPerDay"] as string}
              </InputLabel>
              <Select
                value={mealsPerDay}
                label={messages["clientAccountAccess.summary.mealsPerDay"] as string}
                onChange={(e) => setMealsPerDay(e.target.value)}
              >
                {["2", "3", "4", "5"].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} />}
              label={messages["clientAccountAccess.breakfast"] as string}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={lunch} onChange={(e) => setLunch(e.target.checked)} />}
              label={messages["clientAccountAccess.lunch"] as string}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={dinner} onChange={(e) => setDinner(e.target.checked)} />}
              label={messages["clientAccountAccess.dinner"] as string}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={postWorkout} onChange={(e) => setPostWorkout(e.target.checked)} />}
              label={messages["clientAccountAccess.postWorkout"] as string}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          {messages["clientAccountAccess.applyOptions"] as string}
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={applyScope}
            onChange={(e) => setApplyScope(e.target.value)}
          >
            <FormControlLabel
              value="thisDay"
              control={<Radio size="small" />}
              label={messages["clientAccountAccess.apply.thisDay"] as string}
            />
            <FormControlLabel
              value="fromThisDay"
              control={<Radio size="small" />}
              label={messages["clientAccountAccess.apply.fromThisDay"] as string}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button variant="contained" onClick={() => { onApply(); onClose(); }} sx={{ borderRadius: 2 }}>
          {messages["common.apply"] as string}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeMealPlanModal;

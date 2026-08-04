/** @format */

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

export const parseCutoffTimeValue = (time?: string | null): Dayjs | null => {
  if (!time) return null;

  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(":")
    .map((part) => Number(part));

  return dayjs()
    .hour(Number.isFinite(hours) ? hours : 0)
    .minute(Number.isFinite(minutes) ? minutes : 0)
    .second(Number.isFinite(seconds) ? seconds : 0)
    .millisecond(0);
};

export const formatCutoffTimeValue = (value: Dayjs | null): string | null => {
  if (!value || !value.isValid()) return null;
  return value.format("HH:mm:ss");
};

type Props = {
  label: React.ReactNode;
  value?: string | null;
  onChange: (value: string | null) => void;
  name?: string;
  disabled?: boolean;
};

const AppTimePicker = ({ label, value, onChange, name, disabled }: Props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label={label}
      format="HH:mm"
      ampm={false}
      disabled={disabled}
      value={parseCutoffTimeValue(value)}
      onChange={(newValue) => onChange(formatCutoffTimeValue(newValue))}
      slotProps={{
        textField: {
          name,
          size: "small",
          fullWidth: true,
          autoComplete: "off",
        },
        popper: { placement: "left" },
      }}
    />
  </LocalizationProvider>
);

export default AppTimePicker;

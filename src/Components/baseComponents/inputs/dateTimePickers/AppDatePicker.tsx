/** @format */

import { Popper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import moment from "moment";
import * as React from "react";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppDatePickerProps {
  label: string;
  value?: string;
  onChange: (field: string, value: any) => void;
  name: string;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  errorText?: string;
  error?: boolean;
}

const parseDateValue = (value?: string): Date | null => {
  if (!value) return null;
  const parsed = moment(
    value,
    ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
    true
  );
  return parsed.isValid() ? parsed.toDate() : null;
};

const AppDatePicker: React.FC<IAppDatePickerProps> = (props) => {
  const {
    label,
    value,
    onChange,
    name,
    maxDate,
    minDate,
    disabled = false,
    errorText,
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={<IntlMessages id={label} />}
        format='dd/MM/yyyy'
        value={parseDateValue(value)}
        onChange={(nextValue: Date | null) =>
          onChange(
            name,
            nextValue && !Number.isNaN(nextValue.getTime())
              ? moment(nextValue).format("DD/MM/YYYY")
              : ""
          )
        }
        disabled={disabled}
        slots={{
          popper: (popperProps) => (
            <Popper {...popperProps} placement='left' sx={{ zIndex: 9999 }} />
          ),

          textField: TextField,
        }}
        slotProps={{
          textField: {
            error: !!errorText,
            fullWidth: true,
            name: name,
            size: "small",
            autoComplete: "off",
            helperText: errorText,
            disabled: disabled,
          },
        }}
        maxDate={maxDate}
        minDate={minDate}
      />
    </LocalizationProvider>
  );
};

export default AppDatePicker;

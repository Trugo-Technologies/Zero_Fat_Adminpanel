/** @format */

import { Popper, TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FieldHookConfig, useField } from "formik";

import moment from "moment";
import * as React from "react";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
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
    error = false,
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={<IntlMessages id={label} />}
        format='dd/MM/yyyy'
        value={new Date(value!)}
        onChange={(value: any) =>
          onChange(
            name,
            value && value !== "Invalid date"
              ? moment(value).format("DD/MM/YYYY")
              : ""
          )
        }
        disabled={disabled}
        // moment(value).format("YYYY-MM-DD")
        // onChange={(value: any) => onChange(name, value?.toDateString())}

        slots={{
          popper: (props) => (
            <Popper {...props} placement='left' sx={{ zIndex: 9999 }} />
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
        // PaperProps={{
        //   translate: "yes",
        // }}
      />
    </LocalizationProvider>
  );
};

export default AppDatePicker;

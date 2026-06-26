import { Popper } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import * as React from "react";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppDateTimePickerProps {
  label: string;
  value: string;
  onChange: (field: string, value: any) => void;
  name: string;
}

const AppDateTimePicker: React.FC<IAppDateTimePickerProps> = (props) => {
  const { label, value, onChange, name } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={<IntlMessages id={label} />}
        format="MM/DD/YYYY HH:mm A"
        value={value}
        onChange={(value: any) =>
          onChange(name, moment(value?.$d).toISOString())
        }
        slots={{
          popper: (props) => <Popper {...props} placement="left" />,
          textField: (props: any) => {
            return (
              <AppTextField
                fullWidth
                name={name}
                size="small"
                autoComplete="off"
                {...props}
              />
            );
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default AppDateTimePicker;

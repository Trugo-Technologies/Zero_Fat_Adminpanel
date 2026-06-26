/** @format */

import { Visibility } from "@mui/icons-material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppTextField from "./AppTextField";

type Props = {
  label: string;
  name: string;
};
const AppPasswordField = (props: Props) => {
  const { label, name } = props;
  const { messages } = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <AppTextField
      type={showPassword ? "text" : "password"}
      size='small'
      placeholder={messages[label] as string}
      label={<IntlMessages id={label} />}
      name={name}
      variant='outlined'
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              onClick={handleTogglePassword}
              edge='end'
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      sx={{
        width: "100%",
        "& .MuiInputBase-input": {
          fontSize: 14,
        },
      }}
    />
  );
};

export default AppPasswordField;

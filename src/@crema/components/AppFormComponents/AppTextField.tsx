/** @format */

import { FieldHookConfig, useField } from "formik";
import TextField from "@mui/material/TextField";
import { TextFieldProps } from "@mui/material/TextField/TextField";

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
) => {
  // Prevent arrow keys (up and down)
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
};

export const handleMouseDown = (
  event: React.MouseEvent<HTMLInputElement | HTMLDivElement>
) => {
  // Prevent mouse input
  // event.target instanceof HTMLElement && event.target.blur()
  event.currentTarget.blur();
  event.preventDefault();
};

export const handleWheel = (
  event: React.WheelEvent<HTMLInputElement | HTMLDivElement>
) => {
  // Prevent mouse wheel input
  event.currentTarget.blur();
  event.target instanceof HTMLElement && event.target.blur();
};

const AppTextField = (props: TextFieldProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
      onWheel={handleWheel} // Prevent mouse wheel input
      onKeyDown={handleKeyDown}
      inputProps={{
        style: {
          // Hide spinner arrows for webkit browsers
          appearance: "none", // For modern browsers
          WebkitAppearance: "none", // For WebKit browsers
          MozAppearance: "textfield", // For Firefox
        },
      }} // Also add onMouseDown to inputProps
      sx={{
        "& input[type=number]": {
          // Ensure to hide spinner arrows
          "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
            display: "none", // Chrome, Safari, Edge
          },
          "-moz-appearance": "textfield", // Firefox
        },
      }}
    />
  );
};

export default AppTextField;

import { useTheme } from "@emotion/react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInputProps,
  Box,
  TextFieldProps,
} from "@mui/material";
import TextField from "@mui/material/TextField";

import { useField } from "formik";
import { useIntl } from "react-intl";
import { useTranslation } from "src/hooks/use-translation";
type propsType = {
  name: string;
  type?: string;
  label: React.ReactNode;
};
export type OutlinedTextInputProps = propsType & TextFieldProps;
const OutlinedTextInput = ({
  name,
  type,
  label,
  ...props
}: OutlinedTextInputProps) => {
  const [field, meta] = useField(name);
  const theme: any = useTheme();
  const { messages } = useIntl();
  return (
    <FormControl
      key={name}
      fullWidth
      variant="outlined"
      sx={{ ...theme.typography.customInput, minHeight: "40px" }}
    >
      <TextField
        label={Boolean(label)? `${messages[label as string]}`:""}
        autoComplete="off"
        type={type}
        size="small"
        error={Boolean(meta.touched && meta.error)}
        {...field}
        {...props}
        helperText={meta.touched && meta.error ? meta.error : ""}
      />
    </FormControl>
  );
};

export default OutlinedTextInput;

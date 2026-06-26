import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectProps } from "@mui/material/Select";
import { useField } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "src/hooks/use-translation";
import { useIntl } from "react-intl";

type propsType = {
  name: string;
  label: React.ReactNode;
  options?: { key: string; value: any }[];
};
export type SelectInputProps<T> = propsType & SelectProps<T>;

function SelectInput<T>({
  name,
  label,
  options,
  ...props
}: SelectInputProps<T>) {
  const { messages } = useIntl();
  const theme: any = useTheme();
  const [field, meta] = useField(name);
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);

  return (
    <FormControl
      key={name}
      error={isError}
      // sx={{ ...theme.typography.customInput }}
      fullWidth
      size="small"
    >
      <InputLabel id="demo-simple-select-label">
        <> {messages[label as string]}</>
      </InputLabel>
      <Select
        size="small"
        label={messages[label as string] as string}
        // inputProps={{ sx: { ...theme.typography.customInput } }}
        labelId="demo-simple-select-label"
        {...field}
        {...props}
      >
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      </Select>
      {isError && <FormHelperText>{meta.error ?? ""}</FormHelperText>}
    </FormControl>
  );
}

export default SelectInput;

import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import { useField } from "formik";
type propsType = {
  name: string;
  label: React.ReactNode;
  options?: { value: string; key: string }[];
  isRow?: boolean;
};
export type FormRadioGroupTypes = propsType & RadioGroupProps;
const FormRadioGroup = ({
  options,
  label,
  name,
  isRow = false,
  ...props
}: FormRadioGroupTypes) => {
  const [field, meta] = useField(name);
  return (
    <FormControl key={name}>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup row={isRow} {...field} {...props}>
        {options?.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio />}
            label={option.key}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default FormRadioGroup;

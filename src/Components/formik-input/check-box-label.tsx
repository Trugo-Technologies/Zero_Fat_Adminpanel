import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useTranslation } from "src/hooks/use-translation";
type propsType = {
  name: string;
  label: string;
};
export type CheckBoxLabelType = propsType & CheckboxProps;
const CheckBoxLabel = ({ name, label, ...props }: CheckBoxLabelType) => {
  const [field, meta] = useField(name);
  const { messages } = useIntl();

  const { setFieldValue } = useFormikContext();
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);

  return (
    <FormControl key={name} error={isError}>
      <FormControlLabel
        control={
          <Checkbox
            checked={field.value ?? false}
            onChange={(e) => {
              setFieldValue(field.name, e.target.checked);
            }}
            {...props}
          />
        }
        label={messages[label] as string}
      />
    </FormControl>
  );
};

export default CheckBoxLabel;

/** @format */

import {
  CheckboxProps,
  TextFieldProps,
  RadioGroupProps,
  SelectProps,
  OutlinedInputProps,
} from "@mui/material";
import {
  DatePickerProps,
  DateTimePickerProps,
  TimePickerProps,
} from "@mui/x-date-pickers";
import { Moment } from "moment";
import CheckBoxLabel from "src/Components/formik-input/check-box-label";
import DateInput from "src/Components/formik-input/date-input";
import DateTimeInput from "src/Components/formik-input/date-time-input";
import MultiChipSelect from "src/Components/formik-input/multi-chip-select";
import OutlinedPasswordInput from "src/Components/formik-input/outlined-password-input";
import FormRadioGroup from "src/Components/formik-input/Form-radio-group";
import OutlinedTextInput from "./outlined-text-input";
import SelectInput from "src/Components/formik-input/select-input";
import TimeInput from "src/Components/formik-input/time-input";
import FileInput from "./file-input";
import { dynamicFormType, inputType } from "src/types";
import { InputFieldProps } from "./file-input";
import AppCustomizedSwitch from "src/Components/formik-input/custom-switch";

function DynamicInput({
  name,
  label,
  inputType: type,
  ...props
}: dynamicFormType) {
  let Component: React.ReactNode;

  switch (type) {
    case inputType.checkBox: {
      const checkboxProps = props as CheckboxProps;
      Component = (
        <CheckBoxLabel name={name} label={label} {...checkboxProps} />
      );
      break;
    }
    case inputType.switch: {
      const checkboxProps = props as CheckboxProps;
      Component = <AppCustomizedSwitch name={name} {...checkboxProps} />;
      break;
    }
    case inputType.date: {
      const dateProps = props as DatePickerProps<Moment>;
      Component = (
        <DateInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...dateProps}
        />
      );
      break;
    }
    case inputType.dateTime: {
      const dateTimeProps = props as DateTimePickerProps<Moment>;
      Component = (
        <DateTimeInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...dateTimeProps}
        />
      );
      break;
    }
    case inputType.multiSelect: {
      const multiSelectProps = props as SelectProps<string[]>;
      Component = (
        <MultiChipSelect
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...multiSelectProps}
        />
      );
      break;
    }
    case inputType.password: {
      const passwordProps = props as OutlinedInputProps;
      Component = (
        <OutlinedPasswordInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...passwordProps}
        />
      );
      break;
    }
    case inputType.radio: {
      const radioProps = props as RadioGroupProps;
      Component = (
        <FormRadioGroup
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...radioProps}
        />
      );
      break;
    }
    case inputType.select: {
      const selectProps = props as SelectProps<string>;
      Component = (
        <SelectInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...selectProps}
        />
      );

      break;
    }
    case inputType.text: {
      const textProps = props as TextFieldProps;
      Component = (
        <OutlinedTextInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...textProps}
        />
      );
      break;
    }
    case inputType.time: {
      const timeProps = props as TimePickerProps<Moment>;
      Component = (
        <TimeInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...timeProps}
        />
      );
      break;
    }
    case inputType.image: {
      const imageProps = props as Omit<Omit<InputFieldProps, "name">, "label">;
      Component = (
        <FileInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...imageProps}
        />
      );
      break;
    }

    default: {
      const textProps = props as TextFieldProps;
      Component = (
        <OutlinedTextInput
          label={(label ?? "") as React.ReactNode}
          name={name}
          {...textProps}
        />
      );
      break;
    }
  }

  return Component;
}

export default DynamicInput;

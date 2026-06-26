/** @format */

import React from "react";
import FileInput, {
  InputFieldProps,
} from "src/Components/formik-input/file-input";
type imageProps = Omit<InputFieldProps, "name">;
function AppImageField({ name, ...props }: { name: string } & imageProps) {
  return <FileInput name={name} {...props} label={props.label} />;
}

export default AppImageField;

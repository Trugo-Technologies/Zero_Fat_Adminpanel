/** @format */

import { Autocomplete, Chip, FormHelperText, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";
import IntlMessages from "src/@crema/helpers/IntlMessages";
type formikContextType = { tags: string[] };

interface IAppTagsProps {
  onChangeAutoComplete: (event: any, value: any) => void;
  label: string;
  value: Array<string>;
  error?: string | string[] | undefined;
  touched?: boolean;
}
const AppTags: React.FC<IAppTagsProps> = (props) => {
  const { onChangeAutoComplete, value, label, touched, error } = props;
  return (
    <Autocomplete
      multiple
      id='tags-filled'
      options={[]}
      value={value}
      defaultValue={value}
      onChange={onChangeAutoComplete}
      freeSolo
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              size='small'
              variant='outlined'
              label={option}
              key={key}
              {...tagProps}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label={<IntlMessages id={label} />}
          size='small'
          error={touched && Boolean(error)}
          helperText={touched && error}
        />
      )}
    />
  );
};

export default AppTags;

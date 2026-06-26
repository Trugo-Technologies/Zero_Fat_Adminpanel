import { FieldHookConfig, useField } from 'formik';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { SelectProps } from '@mui/material/Select/Select';
import { FormControl, InputLabel } from '@mui/material';

const AppSelectField = (props: SelectProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <>
      <FormControl sx={{ minWidth: 120 }} size='small' fullWidth>
        {errorText ? (
          <InputLabel color='error' id='demo-select-small'>
            {props.label}
          </InputLabel>
        ) : (
          <InputLabel id='demo-select-small'>{props.label}</InputLabel>
        )}
        <Select {...props} {...field} error={!!errorText} />
      </FormControl>
      {!!errorText && <FormHelperText style={{ color: '#f44336' }}>{errorText}</FormHelperText>}
    </>
  );
};

export default AppSelectField;

import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import * as React from 'react';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IAppSwitchProps {
  label: string;
  keyName: string;
  onChange: (field: string, value: any) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
  nowrap?: boolean;
  color?: 'info' | 'default' | 'error' | 'primary' | 'warning' | 'secondary' | 'success';
}

const AppCheckbox: React.FC<IAppSwitchProps> = (props) => {
  const { label, keyName, defaultChecked = false, onChange, color = 'primary', disabled = false, nowrap = false } = props;

  return (
    <FormGroup>
      <FormControlLabel
        style={{ whiteSpace: nowrap ? 'nowrap' : 'inherit' }}
        control={
          <Checkbox name={keyName} onChange={(value: any) => onChange(keyName, value.target.checked)} defaultChecked={defaultChecked} checked={defaultChecked} color={color} disabled={disabled} />
        }
        label={<IntlMessages id={label} />}
      />
    </FormGroup>
  );
};

export default AppCheckbox;

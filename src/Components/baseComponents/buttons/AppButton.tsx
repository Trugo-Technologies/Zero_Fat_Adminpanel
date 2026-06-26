import { LoadingButton } from '@mui/lab';
import { SxProps, Theme } from '@mui/material';

import * as React from 'react';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IAppButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'error' | 'primary' | 'info' | 'inherit' | 'secondary' | 'success' | 'warning';
  type?: any;
  loading?: boolean;
  label: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  sxProp?: SxProps<Theme>;
  action?: (action: any) => void;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

const AppButton: React.FC<IAppButtonProps> = (props) => {
  const { variant = 'contained', color = 'primary', type = 'button', size = 'small', disabled = false, loading = false, label, onClick, sxProp, startIcon, fullWidth, action = (action) => {} } = props;

  return (
    <LoadingButton
      size={size}
      variant={variant}
      color={color}
      type={type}
      loading={loading}
      onClick={() => {
        onClick && onClick();
      }}
      disabled={disabled}
      sx={sxProp}
      action={action}
      startIcon={startIcon}
      fullWidth={fullWidth}
    >
      <IntlMessages id={label} />
    </LoadingButton>
  );
};

export default AppButton;

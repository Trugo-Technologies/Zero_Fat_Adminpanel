import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import * as React from 'react';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IAddDataGridActivationProps {
  value: boolean;
  handleClick: () => void;
  sxProp?: SxProps<Theme>;
}

const AddDataGridActivation: React.FC<IAddDataGridActivationProps> = (props) => {
  const { value, handleClick, sxProp = { padding: 0.3 } } = props;
  const { locale } = useIntl();

  return (
    <Tooltip title={<IntlMessages id={value ? 'table.actions.deactivate' : 'table.actions.activate'} />}>
      <IconButton sx={sxProp} onClick={handleClick}>
        {locale == 'ar-SA' && value ? (
          <ToggleOffIcon fontSize='small' sx={{ color: '#11c15b' }} />
        ) : locale == 'ar-SA' && !value ? (
          <ToggleOnIcon fontSize='small' sx={{ color: 'red' }} />
        ) : locale == 'en-US' && value ? (
          <ToggleOnIcon fontSize='small' sx={{ color: '#11c15b' }} />
        ) : (
          <ToggleOffIcon fontSize='small' sx={{ color: 'red' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default AddDataGridActivation;

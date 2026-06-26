import React from 'react';
import { Chip } from '@mui/material';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IStatusBadgeProps {
  isActive: boolean;
}

const StatusBadge: React.FC<IStatusBadgeProps> = (props) => {
  const { messages } = useIntl();
  const { isActive } = props;

  return (
    <>
      {isActive ? (
        <Chip size='small' label={<IntlMessages id='columns.active' />} color='success' variant='filled' sx={{ color: '#fff' }} />
      ) : (
        <Chip size='small' label={<IntlMessages id='columns.inactive' />} color='error' variant='filled' />
      )}
    </>
  );
};

export default StatusBadge;

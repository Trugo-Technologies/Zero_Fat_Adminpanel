import { Box } from '@mui/material';
import * as React from 'react';
import IntlMessages from '../../../../src/@crema/helpers/IntlMessages';

interface IAppBoxBadgeProps {
  label: string;
  backgroundColor: string;
}

const AppBoxBadge: React.FC<IAppBoxBadgeProps> = (props) => {
  const { label, backgroundColor } = props;

  return (
    <Box
      sx={{
        color: 'white',
        backgroundColor: backgroundColor,
        padding: '1.5px 10px 3px 10px',
        borderRadius: 3,
        display: 'inline-block',
        margin: '2px',
      }}
    >
      <IntlMessages id={label} />
    </Box>
  );
};

export default AppBoxBadge;

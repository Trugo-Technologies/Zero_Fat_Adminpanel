import { Box } from '@mui/material';
import * as React from 'react';
import IntlMessages from '../../../../src/@crema/helpers/IntlMessages';

interface IAppBoxBadgeProps {
  label: string;
  backgroundColor: string;
  /** When false, renders `label` as plain text (backend value). Default true. */
  translate?: boolean;
}

const AppBoxBadge: React.FC<IAppBoxBadgeProps> = (props) => {
  const { label, backgroundColor, translate = true } = props;

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
      {translate ? <IntlMessages id={label} /> : label}
    </Box>
  );
};

export default AppBoxBadge;

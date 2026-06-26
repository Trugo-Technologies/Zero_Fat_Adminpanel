import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IAppIconButtonProps {
  label: string;
  childComp: React.ReactNode;
  handleClick?: () => void;
  sxProp?: SxProps<Theme>;
  withLink?: boolean;
  toPathLink?: string;
  disabled?: boolean;
}

const AppIconButton: React.FC<IAppIconButtonProps> = (props) => {
  const { label, childComp, disabled = false, handleClick, sxProp = { padding: 0.3 }, withLink = false, toPathLink = '' } = props;

  return (
    <>
      {withLink ? (
        <Tooltip title={<IntlMessages id={label} />}>
          <Link to={toPathLink}>
            <IconButton sx={sxProp}>{childComp}</IconButton>
          </Link>
        </Tooltip>
      ) : (
        <Tooltip title={<IntlMessages id={label} />}>
          <IconButton disabled={disabled} sx={sxProp} onClick={handleClick}>
            {childComp}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default AppIconButton;

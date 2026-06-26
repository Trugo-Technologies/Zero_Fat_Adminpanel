import { AppState } from '@auth0/auth0-react';
import HomeIcon from '@mui/icons-material/Home';
import { Grid, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IntlMessages from 'src/@crema/helpers/IntlMessages';

interface IAppBreadcrumbProps {
  paths?: any[];
  currentPathName: string;
  isShow?: boolean;
  withStatus?: boolean;
  StatusComponent?: React.ReactNode;
}

const AppBreadcrumb: React.FC<IAppBreadcrumbProps> = (props) => {
  const { paths, currentPathName, isShow = true, withStatus = false, StatusComponent } = props;
  const navigate = useNavigate();
  const { messages } = useIntl();

  return (
    <>
      {isShow && (
        <Grid container justifyContent={'space-between'}>
          <Breadcrumbs separator='›' aria-label='breadcrumb'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#a5d060',
              }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize='small' />
              <IntlMessages id='sidebar.dashboard' />
            </div>

            {paths?.map((item, index) => (
              <Link
                key={index}
                underline={item.path ? 'hover' : 'none'}
                color='#a5d060'
                href={`/#${item.path}` || '#'}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (item.path) navigate(item.path);
                }}
                sx={{ cursor: item.path ? 'pointer' : 'default' }}
              >
                {item.name}
              </Link>
            ))}
            {currentPathName ? (
              <Typography color='#a5d060' fontWeight={'600'}>
                <IntlMessages id={currentPathName} />
              </Typography>
            ) : null}
          </Breadcrumbs>
          <Grid item>{withStatus ? <>{StatusComponent}</> : null}</Grid>
        </Grid>
      )}
    </>
  );
};

export default AppBreadcrumb;

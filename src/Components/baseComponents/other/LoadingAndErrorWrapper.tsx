import { Grid, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import * as React from 'react';
import AppLoader from 'src/@crema/components/AppLoader';

export interface ILoadingAndErrorWrapperProps {
  isLoading: boolean;
  errorMessage: string | null;
  children: React.ReactNode;
}

const LoadingAndErrorWrapper: React.FC<ILoadingAndErrorWrapperProps> = (props) => {
  const { isLoading, errorMessage, children } = props;

  if (isLoading)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ py: 15 }}>
          <AppLoader />
        </Grid>
      </Grid>
    );

  if (errorMessage)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography color='error' align='center' sx={{ py: 5 }}>
            {errorMessage}
          </Typography>
        </Grid>
      </Grid>
    );

  return <>{children}</>;
};

export default LoadingAndErrorWrapper;

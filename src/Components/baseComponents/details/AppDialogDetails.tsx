import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import * as React from 'react';
import IntlMessages from 'src/@crema/helpers/IntlMessages';
import AppButton from '../buttons/AppButton';
import LoadingAndErrorWrapper from '../other/LoadingAndErrorWrapper';

interface IAppDialogDetailsProps {
  label?: string;
  open: boolean;
  maxWidthAsPixel?: number;
  columns?: number;
  onClose: () => void;
  maxWidth?: 'lg' | 'md' | 'sm' | 'xs' | 'xl';
  loading: boolean;
  errorMessage: any;
  itemName: string;
  spacing?: number;
  showInCenter?: boolean;
  children: React.ReactNode;
}

const AppDialogDetails: React.FC<IAppDialogDetailsProps> = (props) => {
  const {
    label,
    open,
    onClose,
    loading,
    maxWidthAsPixel,
    columns = undefined,
    spacing = undefined,
    maxWidth = !maxWidthAsPixel ? 'md' : undefined,
    errorMessage,
    children,
    itemName,
    showInCenter = false,
  } = props;

  // const useDialogStyles = makeStyles({
  //   paper: {
  //     minWidth: `${maxWidthAsPixel}px`,
  //   },
  // });

  // const dialogClasses = useDialogStyles();
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          {label && <IntlMessages id={label} />}
          {itemName && <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}> {itemName}</span>}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <LoadingAndErrorWrapper isLoading={loading} errorMessage={errorMessage?.response?.data.messages[0]}>
            <Grid display={showInCenter ? 'flex' : undefined} justifyContent={showInCenter ? 'center' : undefined} columns={columns} spacing={spacing} container>
              {children}
            </Grid>
          </LoadingAndErrorWrapper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} color='secondary' label='common.cancel' />
      </DialogActions>
    </Dialog>
  );
};

export default AppDialogDetails;

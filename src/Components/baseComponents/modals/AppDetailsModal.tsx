import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import IntlMessages from 'src/@crema/helpers/IntlMessages';
import AppButton from '../buttons/AppButton';
import LoadingAndErrorWrapper from '../other/LoadingAndErrorWrapper';

interface IAppDetailsModalProps {
  label: string;
  open: boolean;
  onClose: () => void;
  maxWidth?: any;
  loading: boolean;
  children: React.ReactNode;

  errorMessage: any;
}

const AppDetailsModal: React.FC<IAppDetailsModalProps> = (props) => {
  const { label, open, onClose, maxWidth = 'md', loading, errorMessage, children } = props;

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={label} />
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <LoadingAndErrorWrapper isLoading={loading} errorMessage={errorMessage?.response?.data.messages[0]}>
          {children}
        </LoadingAndErrorWrapper>
      </DialogContent>
      <DialogActions>
        <AppButton size='medium' onClick={onClose} color='secondary' label='common.cancel' />
      </DialogActions>
    </Dialog>
  );
};

export default AppDetailsModal;

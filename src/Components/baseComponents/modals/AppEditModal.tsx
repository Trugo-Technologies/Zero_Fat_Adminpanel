import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useEffect } from 'react';
import IntlMessages from 'src/@crema/helpers/IntlMessages';
import AppButton from '../buttons/AppButton';
import LoadingAndErrorWrapper from '../other/LoadingAndErrorWrapper';

interface IAppEditModalProps {
  label: string;
  open: boolean;
  onClose: () => void;
  loadingForEdit: boolean;
  loading: boolean;
  errorMessage: string;
  itemName: string;
  maxWidth?: 'lg' | 'md' | 'sm' | 'xs' | 'xl';
  handleSubmit: () => void;
  closeModalState: (isOpen: boolean) => void;
  successClose: boolean;
  maxWidthAsPixel?: number;
  children: React.ReactNode;
}

const AppEditModal: React.FC<IAppEditModalProps> = (props) => {
  const {
    maxWidthAsPixel,
    label,
    open,
    onClose,
    loadingForEdit,
    loading,
    errorMessage,
    maxWidth = !maxWidthAsPixel ? 'md' : undefined,
    handleSubmit,
    children,
    itemName,
    closeModalState,
    successClose,
  } = props;

  useEffect(() => {
    if (successClose) closeModalState(false);
  }, [successClose]);

  // const useDialogStyles = makeStyles({
  //   paper: {
  //     minWidth: `${maxWidthAsPixel}px`,
  //     zIndex: '9999 !important',
  //   },
  // });
  // const dialogClasses = useDialogStyles();

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={label} />
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{itemName}</span>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <LoadingAndErrorWrapper isLoading={loading} errorMessage={errorMessage}>
          {children}
        </LoadingAndErrorWrapper>
      </DialogContent>
      <DialogActions>
        <AppButton label='common.cancel' color='warning' onClick={onClose} />
        <AppButton label='common.save' loading={loadingForEdit} onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default AppEditModal;

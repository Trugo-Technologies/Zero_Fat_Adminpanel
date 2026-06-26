/** @format */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import AppButton from "src/Components/baseComponents/buttons/AppButton";

interface IAppStepperEditModalProps {
  label: string;
  open: boolean;
  onClose: () => void;
  loadingForEdit: boolean;
  children: React.ReactNode;

  loading: boolean;
  errorMessage: string;
  itemName: string;
  maxWidth?: any;
  handleSubmit: () => void;
  closeModalState: (isOpen: boolean) => void;
  successClose: boolean;
  maxWidthAsPixel?: number;
  labelForEditBtn?: string;
  handleBack?: () => void;
}

const AppStepperEditModal: React.FC<IAppStepperEditModalProps> = (props) => {
  const {
    maxWidthAsPixel,
    label,
    open,
    onClose,
    loadingForEdit,
    loading,
    errorMessage,
    maxWidth = !maxWidthAsPixel ? "md" : undefined,
    handleSubmit,
    children,
    itemName,
    closeModalState,
    successClose,
    labelForEditBtn,
    handleBack,
  } = props;

  React.useEffect(() => {
    if (successClose) closeModalState(false);
  }, [successClose]);

  //   const useDialogStyles = makeStyles({
  //     paper: {
  //       minWidth: `${maxWidthAsPixel}px`,
  //       zIndex: '9999 !important',
  //     },
  //   });
  //   const dialogClasses = useDialogStyles();

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          minWidth: `${maxWidthAsPixel}px`,
          zIndex: "9999 !important",
        },
      }}>
      <DialogTitle>
        <Typography
          color='primary'
          variant='h3'
          sx={{ display: "flex", alignItems: "center" }}>
          <IntlMessages id={label} />
          {itemName && (
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {itemName}
            </span>
          )}
          {/* Close Button */}
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[400],
            }}>
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <LoadingAndErrorWrapper isLoading={loading} errorMessage={errorMessage}>
          {children}
        </LoadingAndErrorWrapper>
      </DialogContent>
      <DialogActions>
        <AppButton label='common.close' color='warning' onClick={onClose} />

        {handleBack !== undefined ? (
          <AppButton
            label='common.back'
            sxProp={{
              backgroundColor: "#2e3d16a6",
            }}
            onClick={handleBack}
          />
        ) : null}
        <AppButton
          label={
            labelForEditBtn && labelForEditBtn
              ? `${labelForEditBtn}`
              : "common.save"
          }
          loading={loadingForEdit}
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AppStepperEditModal;

/** @format */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import React from "react";

interface IAppStepperAddModalProps {
  label: string;
  open: boolean;
  onClose: () => void;
  loadingForAdd: boolean;
  maxWidthAsPixel?: number;
  maxHeightAsPixel?: number;
  itemName?: string;
  labelForAddBtn?: string;
  children: React.ReactNode;

  maxWidth?: "lg" | "md" | "sm" | "xs" | "xl";
  handleSubmit: () => void;
  closeModalState: (isOpen: boolean) => void;
  successClose: boolean;
  handleBack?: () => void;
}

const AppStepperAddModal: React.FC<IAppStepperAddModalProps> = (props) => {
  const {
    maxWidthAsPixel,
    maxHeightAsPixel,
    label,
    open,
    onClose,
    loadingForAdd,
    maxWidth = !maxWidthAsPixel ? "md" : undefined,
    children,
    handleSubmit,
    closeModalState,
    successClose,
    itemName,
    labelForAddBtn,
    handleBack,
  } = props;

  // const useDialogStyles = makeStyles({
  //   paper: {
  //     minWidth: `${maxWidthAsPixel}px`,
  //     minHeight: `${maxHeightAsPixel}px`,
  //     zIndex: '9999 !important',
  //   },
  // });

  // const dialogClasses = useDialogStyles();

  React.useEffect(() => {
    if (successClose) closeModalState(false);
  }, [successClose]);

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          minWidth: `${maxWidthAsPixel}px`,
          minHeight: `${maxHeightAsPixel}px`,
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
      <DialogContent dividers>{children}</DialogContent>
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
            labelForAddBtn && labelForAddBtn
              ? `${labelForAddBtn}`
              : "common.add"
          }
          loading={loadingForAdd}
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AppStepperAddModal;

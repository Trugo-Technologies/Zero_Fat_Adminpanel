/** @format */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
interface IAppAddModalProps {
  label: string;

  secLabel?: string;
  withLabel?: boolean;
  open: boolean;
  onClose?: () => void;
  loadingForAdd?: boolean;
  maxWidthAsPixel?: number;
  maxHeightAsPixel?: number;
  itemName?: string;
  secItemName?: string;
  labelForAddBtn?: string;
  children: React.ReactNode;
  maxWidth?: "lg" | "md" | "sm" | "xs" | "xl";
  handleSubmit?: () => void;
  closeModalState: (isOpen: boolean) => void;
  successClose?: boolean;
  showActions?: boolean;
  generateFormMode?: boolean;
  isLoading?: boolean;
}

const AppAddModal: React.FC<IAppAddModalProps> = (props) => {
  const {
    maxWidthAsPixel,
    maxHeightAsPixel,
    label,
    withLabel = true,
    secLabel,
    open,
    onClose,
    loadingForAdd,
    maxWidth = !maxWidthAsPixel ? "md" : undefined,
    children,
    handleSubmit,
    closeModalState,
    successClose,
    itemName,
    secItemName,
    labelForAddBtn,
    showActions = true,
    generateFormMode = false,
    isLoading,
  } = props;

  // const useDialogStyles = makeStyles({
  //   paper: {
  //     minWidth: `${maxWidthAsPixel}px`,
  //     minHeight: `${maxHeightAsPixel}px`,
  //     zIndex: "9999 !important",
  //   },
  // });

  // const dialogClasses = useDialogStyles();
  React.useEffect(() => {
    if (successClose) closeModalState && closeModalState(false);
  }, [successClose]);
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open}>
      <DialogTitle>
        {secLabel && secItemName && (
          <>
            <Typography color='green' variant='h3' fontWeight={"600"}>
              <IntlMessages id={secLabel} />
              <span
                style={{
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}>
                {secItemName}
              </span>
              {secItemName && <div style={{ margin: "10px 0" }} />}
            </Typography>
          </>
        )}
        {withLabel && (
          <>
            <Typography color='primary' variant='h3'>
              <IntlMessages id={label} />
              {itemName && (
                <span
                  style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                  {itemName}
                </span>
              )}
            </Typography>
          </>
        )}
      </DialogTitle>
      <LoadingAndErrorWrapper isLoading={isLoading ?? false} errorMessage={""}>
        {generateFormMode ? (
          <>{children}</>
        ) : (
          <DialogContent dividers>{children}</DialogContent>
        )}
      </LoadingAndErrorWrapper>
      {showActions && (
        <DialogActions>
          <AppButton
            label='common.cancel'
            color='warning'
            onClick={() => {
              if (onClose) onClose();
            }}
          />
          <AppButton
            label={
              labelForAddBtn && labelForAddBtn
                ? `${labelForAddBtn}`
                : "common.add"
            }
            loading={loadingForAdd}
            onClick={() => {
              if (handleSubmit) handleSubmit();
            }}
          />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AppAddModal;

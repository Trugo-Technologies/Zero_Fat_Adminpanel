import { Snackbar, Alert, Typography, Slide } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "src/hooks/use-translation";
import { resetAuthData } from "src/app/login/services/slice";
// import { getErrorMessageFromCode } from 'src/helpers/get-error-message-from-code';
// import handleErrorTokenFromErrorCode from 'src/helpers/handle-error-token-from-error-code';
import { useAppDispatch } from "src/hooks/useAppDispatch";
import WarningIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import AppMessageView from "src/@crema/components/AppMessageView";
import { useInfoViewActionsContext } from "src/@crema/context/AppContextProvider/InfoViewContextProvider";
let showErrorToasts: Function;
let showSuccessToasts: Function;

const success = (message: string) => (
  <Alert
    sx={{ p: 2, borderRadius: "20px", bgcolor: "success.main" }}
    severity="success"
    icon={<CheckIcon sx={{ color: "white" }} />}
  >
    <Typography sx={{ fontWeight: "bold", fontSize: "16px", color: "white" }}>
      {message}
    </Typography>
  </Alert>
);

const error = (message: string) => (
  <Alert
    sx={{
      // p: 2,
      // borderRadius: "20px",
      bgcolor: "error.light",
      color: "white",
    }}
    security="error"
    icon={<WarningIcon sx={{ color: "white" }} />}
  >
    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
      {message}
    </Typography>
  </Alert>
);

const Toasts = () => {
  const { t } = useTranslation("translation");
  const infoViewActionsContext = useInfoViewActionsContext();

  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<{
    variant: "error" | "success" | null;
    message: string | null;
  }>({
    variant: null,
    message: null,
  });

  const handleClose = () => {
    setOpen({ variant: null, message: null });
  };
  showErrorToasts = (message: string) => {
    // handleErrorTokenFromErrorCode(`${code}`) ? dispatch(resetAuthData()) : null;
    setOpen({ variant: "error", message: message });
  };

  showSuccessToasts = (message: string) => {
    setOpen({ variant: "success", message: message });
  };

  return (
    <>
      <AppMessageView
        variant={open.variant || "error"}
        message={open?.message ?? ""}
        clearInfoView={handleClose}
      />
      {/* <Snackbar
        key={open.code}
        TransitionComponent={(props) => <Slide {...props} direction='left' />}
        open={Boolean(open.code)}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={handleClose}
      >
        {error(open?.message ?? '')}
      </Snackbar> */}
      {/* <Snackbar
        key={open.code + '1'}
        TransitionComponent={(props) => <Slide {...props} direction='right' />}
        open={Boolean(open.message)}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={handleClose}
      >
        {success(t(open.message ?? '') ?? '')}
      </Snackbar> */}
    </>
  );
};
export { showErrorToasts, showSuccessToasts };

export default Toasts;

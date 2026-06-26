/** @format */

import {
  ButtonBaseActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { ReactNode, useRef } from "react";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  // eslint-disable-next-line no-undef
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

interface IAppConfirmModalProps {
  dialogTitle: string | ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string | ReactNode;
  colorTitle?: string;
  itemName?: string;
  onConfirm: () => void;
  loading: boolean;
}

const AppConfirmModal: React.FC<IAppConfirmModalProps> = (
  props: IAppConfirmModalProps
) => {
  const { messages, locale } = useIntl();

  const {
    open,
    setOpen,
    title,
    dialogTitle,
    loading = false,
    itemName = locale === "en-US" ? "?" : "؟",
    onConfirm,
    colorTitle = "#C10E0E",
  } = props;

  const actionRef = useRef<ButtonBaseActions | null>(null);
  const onEntered = () => actionRef?.current?.focusVisible();

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      TransitionProps={{ onEntered }}
      onClose={() => setOpen(false)}>
      <DialogTitle>
        <Typography
          component='h4'
          variant='h4'
          color={colorTitle}
          sx={{
            fontWeight: Fonts.SEMI_BOLD,
          }}
          id='alert-dialog-title'>
          <IntlMessages id={dialogTitle} />
        </Typography>
      </DialogTitle>
      <Divider variant='fullWidth' />

      <DialogContent
        sx={{ color: "text.secondary", fontSize: 16 }}
        id='alert-dialog-description'>
        <span style={{ textTransform: "capitalize" }}>
          <IntlMessages id={title} />{" "}
          <span style={{ fontWeight: "bold" }}>{itemName}</span>
        </span>
      </DialogContent>
      <DialogActions
        sx={{
          pb: 5,
          px: 6,
        }}>
        <AppButton
          variant='contained'
          sxProp={{ fontWeight: Fonts.MEDIUM }}
          size='small'
          onClick={() => setOpen(false)}
          color='secondary'
          label={"common.no"}
        />
        <AppButton
          variant='contained'
          sxProp={{ fontWeight: Fonts.MEDIUM }}
          size='small'
          onClick={onConfirm}
          color='primary'
          label={"common.yes"}
          loading={loading}
          action={(actions) => (actionRef.current = actions)}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AppConfirmModal;

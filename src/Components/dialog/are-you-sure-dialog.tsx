/** @format */

import { Button, Stack, Typography } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import SimpleDialog from "src/Components/dialog";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
type propsType = {
  open: boolean;
  setOpen: Function;
  confirmHandler: Function;
  isWarning?: boolean;
  message?: string;
};
function AreYouSureDialog({
  open,
  setOpen,
  confirmHandler,
  isWarning,
  message = "Are you sure",
}: propsType) {
  // const { t } = useTranslation("translation");
  return (
    <SimpleDialog
      open={open}
      setOpen={setOpen}
      PaperProps={{ sx: { minWidth: "300px", p: 2, maxWidth: "300px" } }}>
      <DialogContent>
        <Stack direction='column' justifyContent='center' alignItems='center'>
          {isWarning ? (
            <GppMaybeIcon color='warning' sx={{ fontSize: "60px" }} />
          ) : (
            <QuestionMarkIcon color='warning' sx={{ fontSize: "50px" }} />
          )}
          <Typography variant='h4' textAlign='center' mt={2}>
            {message}
          </Typography>
        </Stack>
      </DialogContent>

      <Stack direction='row' justifyContent='space-around' gap={2}>
        <Button
          fullWidth
          color='primary'
          variant='contained'
          onClick={() => {
            confirmHandler();
            setOpen(false);
          }}
          sx={{ borderRadius: "10px" }}>
          {"confirm"}
        </Button>
        <Button
          fullWidth
          // color="inherit"
          variant='outlined'
          onClick={() => {
            setOpen(false);
          }}
          sx={{ borderRadius: "10px" }}>
          {"cancel"}
        </Button>
      </Stack>
    </SimpleDialog>
  );
}

export default AreYouSureDialog;

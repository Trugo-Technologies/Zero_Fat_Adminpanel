import React from "react";
import SimpleDialog from ".";
import { Button, DialogContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "src/hooks/use-translation";
import updateIcon from "src/assets/images/update-icon.svg";
type propsType = {
  open: boolean;
  setOpen: Function;
  update: Function;
};
function UpdateDialog({ open, setOpen, update }: propsType) {
  const { t } = useTranslation("translation");

  return (
    <SimpleDialog
      open={open}
      setOpen={() => {}}
      PaperProps={{ sx: { minWidth: "200px", p: 2, maxWidth: "250px" } }}
    >
      <DialogContent>
        <Stack direction="column" justifyContent="center" alignItems="center">
          {/* <DeleteOutlineIcon color="error" sx={{ fontSize: "40px", mb: 3 }} /> */}
          <img src={updateIcon} alt="" />
          <Typography variant="h4" textAlign="center" mt={2}>
            {t("new content are available")} , {t("do you want to update")}
          </Typography>
          <Typography variant="h4" textAlign="center"></Typography>
        </Stack>
      </DialogContent>

      <Stack direction="row" justifyContent="space-around" gap={2}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            update();
          }}
          sx={{ borderRadius: "10px" }}
        >
          {t("update")}
        </Button>
        <Button
          fullWidth
          color="inherit"
          variant="outlined"
          onClick={() => setOpen(false)}
          sx={{ borderRadius: "10px" }}
        >
          {t("cancel")}
        </Button>
      </Stack>
    </SimpleDialog>
  );
}

export default UpdateDialog;

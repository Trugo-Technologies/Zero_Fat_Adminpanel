import React, { useState } from "react";
import SimpleDialog from ".";
import { Box, Button, Stack, Avatar } from "@mui/material";
import { useTranslation } from "src/hooks/use-translation";
import { baseUrl } from "src/env/base-url";

function ImagePreviewDialog({ url }: { url: string }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>{t("show")}</Button> */}
      <Button onClick={() => setOpen(true)}>
        <Avatar src={baseUrl + `/${url}`} />
      </Button>
      <SimpleDialog
        title={t("imagePreview") ?? ""}
        open={open}
        setOpen={setOpen}
      >
        <Stack p={2} direction="column" justifyContent="center" gap={2}>
          <Box
            sx={{ minWidth: "300px", maxWidth: { xs: "320px", md: "500px" } }}
          >
            <img src={baseUrl + `/${url}`} style={{ width: "100%" }} />
          </Box>
          <Button onClick={() => setOpen(false)} variant="contained">
            {t("close")}
          </Button>
        </Stack>
      </SimpleDialog>
    </>
  );
}

export default ImagePreviewDialog;

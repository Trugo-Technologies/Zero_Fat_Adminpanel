/** @format */

import AddIcon from "@mui/icons-material/Add";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isPrivilegesIncludes } from "src/Helpers/is-privileges-includes";
import { useTranslation } from "src/hooks/use-translation";
import { privilegeFeature, privilegeKeys } from "src/shared/privileges";

function AddButton({
  feature,
  url,
}: {
  feature?: privilegeFeature;
  url?: string | Function;
}) {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const isAllowed = isPrivilegesIncludes(`create${feature}` as privilegeKeys);
  return (
    <Stack
      direction='row'
      alignItems='center'
      gap={1}
      sx={{ margin: "0 4px", display: !isAllowed ? "none" : "" }}>
      {/* <IconButton
        onClick={() => navigate(url)}
        sx={{
          backgroundColor: "primary.main",
          p: 0.5,
          "&:hover": { backgroundColor: "primary.dark" },
          "&.Mui-disabled": { backgroundColor: "primary.light" },
        }}
      >
        
      </IconButton> */}
      <Button
        variant='contained'
        onClick={() => {
          typeof url === "string" ? navigate(url) : url && url();
        }}
        startIcon={<AddIcon />}>
        {t("add")}
        <Typography fontWeight='600' variant='h5'></Typography>
      </Button>
    </Stack>
  );
}

export default AddButton;

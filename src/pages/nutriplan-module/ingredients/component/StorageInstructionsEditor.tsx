/** @format */

import { Grid } from "@mui/material";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";

function StorageInstructionsEditor() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <AppFreeEditor
          name='StorageInstructionsAr'
          label='ingredients.StorageInstructionsAr'
        />
      </Grid>
      <Grid item xs={6}>
        <AppFreeEditor
          name='StorageInstructionsEn'
          label='ingredients.StorageInstructionsEn'
        />
      </Grid>
    </Grid>
  );
}

export default StorageInstructionsEditor;

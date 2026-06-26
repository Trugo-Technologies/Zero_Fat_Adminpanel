/** @format */

import { Grid } from "@mui/material";
import { useFormikContext } from "formik";
import OutlinedTextInput from "src/Components/formik-input/outlined-text-input";
import SelectInput from "src/Components/formik-input/select-input";

function BasicUnitType() {
  const { values } = useFormikContext<any>();
  return (
    <Grid container item spacing={2} xs={12}>
      <Grid item md={6}>
        <SelectInput
          name='BasicUnit'
          label='ingredients.BasicUnitType'
          options={[
            { key: "Solid", value: "Solid" },
            { key: "Liquid", value: "Liquid" },
          ]}
        />
      </Grid>
      <Grid item md={6}>
        {values["BasicUnit"] !== "Solid" && (
          <OutlinedTextInput
            name='Density'
            label='ingredients.Density'
            type='number'
          />
        )}
      </Grid>
    </Grid>
  );
}

export default BasicUnitType;

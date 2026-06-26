/** @format */

import { Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import OutlinedTextInput from "src/Components/formik-input/outlined-text-input";

function AmountsTable() {
  const { messages } = useIntl();
  const amounts = [
    "CaloriesPer100Unit",
    "FatPer100Unit",
    "CarbsPer100Unit",
    "ProteinPer100Unit",
    "FiberPer100Unit",
    "SugarPer100Unit",
    "VitaminContent",
    "MineralContent",
    "WaterPer100g",
  ];
  return (
    <Grid container spacing={2} xs={12}>
      <Grid
        item
        xs={6}
        sx={{ marginBottom: "10px", fontSize: "14px", fontWeight: 600 }}>
        {messages["ingredients.name"] as string}
      </Grid>
      <Grid
        item
        xs={6}
        sx={{ marginBottom: "10px", fontSize: "14px", fontWeight: 600 }}>
        {messages["ingredients.value"] as string}
      </Grid>
      {amounts.map((item, index) => (
        <Grid
          container
          item
          xs={12}
          alignItems='center'
          sx={{
            background: index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : "",
            borderRadius: "10px",
            padding: "8px 2px",
          }}>
          <Grid item xs={6}>
            {messages[`ingredients.${item}`] as string}
          </Grid>
          <Grid item xs={6}>
            <OutlinedTextInput
              name={item}
              label='ingredients.value'
              type='number'
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default AmountsTable;

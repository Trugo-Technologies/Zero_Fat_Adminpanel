/** @format */

import { Fonts } from "@crema/constants/AppEnums";
import { Grid, Typography } from "@mui/material";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type Props = {
  title: string;
  name: string;
  unit: "ml" | "g" | "kcal" | "mg" | "µg";
};

const IngredientQuantityField: React.FC<Props> = ({ name, title, unit }) => {
  return (
    <Grid item container xs={12}>
      <Grid item xs={4}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: Fonts.SEMI_BOLD,
          }}>
          <IntlMessages id={title} />
        </Typography>
      </Grid>

      <Grid item container xs={3} alignItems={"center"} columnGap={2}>
        <Grid xs={8}>
          <AppTextField
            name={name}
            variant='outlined'
            size='small'
            type='number'
            fullWidth
          />
        </Grid>

        <div
          style={{
            fontSize: 14,
            fontWeight: Fonts.SEMI_BOLD,
            margin: "0px 0.5rem",
          }}>
          {unit}
        </div>
      </Grid>
    </Grid>
  );
};

export default IngredientQuantityField;

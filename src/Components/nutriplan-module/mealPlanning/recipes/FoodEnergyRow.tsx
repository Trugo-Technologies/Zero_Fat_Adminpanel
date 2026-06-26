/** @format */

import { Grid, Typography } from "@mui/material";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  calculateTotalCaloriesPer100Unit,
  calculateTotalCarbsPer100Unit,
  calculateTotalFatPer100Unit,
  calculateTotalProteinPer100Unit,
  calculateTotalWaterPer100g,
} from "src/Components/nutriplan-module/mealPlanning/recipes/helper";
import { IRecipeIngredient } from "src/types/modules/nutriplan/mealPlanning/recipes";

interface Props {
  recipeIngredients: IRecipeIngredient[];
}

const FoodEnergyRow = (props: Props) => {
  const { recipeIngredients } = props;

  return (
    <Grid item container xs={12} columnGap={22} mt={4} mb={4}>
      <Grid item>
        <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
          <IntlMessages id='ingredients.caloriesPer100Unit' />{" "}
        </Typography>
        <div>
          {calculateTotalCaloriesPer100Unit(recipeIngredients).toFixed(0) +
            " (kcal)"}
        </div>
      </Grid>
      <Grid item>
        <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
          <IntlMessages id={"ingredients.proteinPer100Unit"} />
        </Typography>
        <div>
          {calculateTotalProteinPer100Unit(recipeIngredients).toFixed(2) +
            " (g)"}
        </div>
      </Grid>
      <Grid item>
        <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
          <IntlMessages id='ingredients.fatPer100Unit' />{" "}
        </Typography>
        <div>
          {calculateTotalFatPer100Unit(recipeIngredients).toFixed(0) + " (g)"}
        </div>
      </Grid>
      <Grid item>
        <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
          <IntlMessages id='ingredients.carbsPer100Unit' />{" "}
        </Typography>
        <div>
          {calculateTotalCarbsPer100Unit(recipeIngredients).toFixed(0) + " (g)"}
        </div>
      </Grid>

      <Grid item>
        <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
          <IntlMessages id='ingredients.waterPer100g' />{" "}
        </Typography>

        <div>
          {calculateTotalWaterPer100g(recipeIngredients).toFixed(0) + " (ml)"}
        </div>
      </Grid>
    </Grid>
  );
};

export default FoodEnergyRow;

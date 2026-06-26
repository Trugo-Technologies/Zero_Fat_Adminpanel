/** @format */

import { Fonts } from "@crema/constants/AppEnums";
import { Grid, Typography } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { IIngredients } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import { basicUnit } from "src/types/enums";

type Props = {
  data: IIngredients | undefined;
};

const FoodEnergyDetails: React.FC<Props> = ({ data }) => {
  return (
    <Grid container spacing={5} item xs={12}>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"common.name"} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"common.value"} />
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.caloriesPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"} columnGap={2}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.caloriesPer100Unit}
              {"(kcal)"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.fatPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.fatPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.carbsPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.carbsPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.proteinPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.proteinPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.proteinPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.proteinPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.fiberPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.fiberPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.sugarPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.sugarPer100Unit}
              {`(${data?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.waterPer100g"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.waterPer100g}
              {`(ml)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.cholesterolPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.cholesterolPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.totalSaturatedFattyAcids"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.totalSaturatedFattyAcids}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid4_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid4_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid6_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid6_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid8_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid8_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid10_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid10_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid12_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid12_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid14_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid14_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid16_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid16_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.saturatedFattyAcid18_0"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.saturatedFattyAcid18_0}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.monounsaturatedFattyAcid16_1"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.monounsaturatedFattyAcid16_1}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.totalMonounsaturatedFattyAcids"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.totalMonounsaturatedFattyAcids}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.monounsaturatedFattyAcid18_1"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.monounsaturatedFattyAcid18_1}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.monounsaturatedFattyAcid20_1"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.monounsaturatedFattyAcid20_1}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.totalPolyunsaturatedFattyAcids"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.totalPolyunsaturatedFattyAcids}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.monounsaturatedFattyAcid22_1"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.monounsaturatedFattyAcid22_1}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid18_2"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid18_2}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid18_3"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid18_3}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid20_4"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid20_4}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid18_4"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid18_4}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid20_5"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid20_5}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid22_5"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid22_5}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.polyunsaturatedFattyAcid22_6"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.polyunsaturatedFattyAcid22_6}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.calciumPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.calciumPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.ironPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.ironPer100Unit}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.magnesiumPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.magnesiumPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.phosphorusPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.phosphorusPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.potassiumPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.potassiumPer100Unit}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.sodiumPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.sodiumPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.zincPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.zincPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.copperPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.copperPer100Unit}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.seleniumPer100Unit"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.seleniumPer100Unit}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminARAE"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminARAE}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.retinol"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.retinol}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.caroteneAlpha"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.caroteneAlpha}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.caroteneBeta"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.caroteneBeta}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.cryptoxanthinBeta"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.cryptoxanthinBeta}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.lycopene"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.lycopene}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.luteinZeaxanthin"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.luteinZeaxanthin}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminE"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminE}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminD"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminD}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminK"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminK}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminC"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminC}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.thiamin"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.thiamin}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.riboflavin"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.riboflavin}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.niacin"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.niacin}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminB6"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminB6}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.folateTotal"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.folateTotal}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.folateDFE"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.folateDFE}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.folicAcid"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.folicAcid}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.folateFood"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.folateFood}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.vitaminB12"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.vitaminB12}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.choline"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.choline}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.alcohol"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.alcohol}
              {`(g)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.caffeine"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.caffeine}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.theobromine"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.theobromine}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.addedVitaminE"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.addedVitaminE}
              {`(mg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id={"ingredients.addedVitaminB12"} />
          </Typography>
        </Grid>
        <Grid item container xs={3} alignItems={"center"}>
          <Grid xs={8}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
              {data?.addedVitaminB12}
              {`(µg)`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FoodEnergyDetails;

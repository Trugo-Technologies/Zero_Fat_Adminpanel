/** @format */

import { Grid } from "@mui/material";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";

interface IProps {
  mealInfo: IMeals;
}

const MealInfo = (props: IProps) => {
  const { mealInfo } = props;

  return (
    <Grid container spacing={5} item xs={12}>
      <AppItemView
        type='image'
        label='common.image'
        value={mealInfo?.imageUrl}
        column={3}
      />
      <AppItemView label='common.nameAr' value={mealInfo?.nameAr} column={3} />
      <AppItemView label='common.nameEn' value={mealInfo?.nameEn} column={3} />
      <AppItemView
        label='meals.priceForCustomer'
        value={mealInfo?.priceForCustomer}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.weightInGrams'
        value={mealInfo?.weightInGrams}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.calories'
        value={mealInfo?.calories}
        column={3}
      />{" "}
      <AppItemView
        label='dailyMenuMeals.fat'
        value={mealInfo?.fat}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.carbs'
        value={mealInfo?.carbs}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.protein'
        value={mealInfo?.protein}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.water'
        value={mealInfo?.water}
        column={3}
      />
      <AppItemView
        label='recipes.specification'
        value={
          <>
            {mealInfo?.isCold && (
              <AppBoxBadge label='recipes.isCold' backgroundColor='#646405' />
            )}
            {mealInfo?.isWarm && (
              <AppBoxBadge label='recipes.isWarm' backgroundColor='#c91c1cbd' />
            )}
            {mealInfo?.isDairyFree && (
              <AppBoxBadge
                label='ingredients.isDairyFree'
                backgroundColor='#a5d060'
              />
            )}
            {mealInfo?.isGlutenFree && (
              <AppBoxBadge
                label='ingredients.isGlutenFree'
                backgroundColor='#71714c'
              />
            )}
            {mealInfo?.isLowGI && (
              <AppBoxBadge
                label='ingredients.isLowGI'
                backgroundColor='#4d9998'
              />
            )}
            {!mealInfo?.isCold &&
              !mealInfo?.isWarm &&
              !mealInfo?.isDairyFree &&
              !mealInfo?.isGlutenFree &&
              !mealInfo?.isLowGI &&
              "-"}
          </>
        }
        column={12}
      />
      <AppItemView
        label='meals.isAddOn'
        value={mealInfo?.isAddOn}
        type='isExist'
        column={3}
      />
      <AppItemView
        label='recipes.suitableForFreezing'
        value={mealInfo?.suitableForFreezing}
        type='isExist'
        column={3}
      />
    </Grid>
  );
};

export default MealInfo;

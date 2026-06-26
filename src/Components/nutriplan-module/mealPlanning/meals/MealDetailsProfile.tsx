/** @format */

import { Grid } from "@mui/material";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import BaseProfileDetails from "src/Components/baseComponents/profile/BaseProfileDetails";
import { IMealsDetailsDto } from "src/types/modules/nutriplan/mealPlanning/meals";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
interface IMealDetailsProfileProps {
  mealItem: IMealsDetailsDto;
}

const MealDetailsProfile = (props: IMealDetailsProfileProps) => {
  const { mealItem } = props;

  return (
    <>
      <BaseProfileDetails
        moreDetails={mealItem as IMealsDetailsDto}
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={mealItem?.data?.nameAr}
            column={3}
          />
          <AppItemView
            label='common.nameEn'
            value={mealItem?.data?.nameEn}
            column={3}
          />
          <AppItemView
            label='recipes.name'
            value={getValueBasedOnCurrentLanguage(
              mealItem?.data?.recipe?.nameAr!,
              mealItem?.data?.recipe?.nameEn!
            )}
            column={3}
          />
          <AppItemView
            label='meals.priceForCustomer'
            value={mealItem?.data?.priceForCustomer?.toFixed(0)}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.weightInGrams'
            value={Number(mealItem?.data?.weightInGrams)?.toFixed(0)}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.calories'
            value={Number(mealItem?.data?.calories)?.toFixed(0)}
            column={3}
          />{" "}
          <AppItemView
            label='dailyMenuMeals.fat'
            value={Number(mealItem?.data?.fat)?.toFixed(0)}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.carbs'
            value={Number(mealItem?.data?.carbs)?.toFixed(0)}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.protein'
            value={Number(mealItem?.data?.protein)?.toFixed(0)}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.water'
            value={Number(mealItem?.data?.water)?.toFixed(0)}
            column={3}
          />
          {/* <AppItemView
            label="dailyMenuMeals.isDefault"
            value={mealItem?.data?.isDefault}
            type="isExist"
            column={3}
          /> */}
          <AppItemView
            label='sidebar.allergens'
            value={getValueBasedOnCurrentLanguage(
              mealItem?.data?.allergens
                ?.map((item: IAllergens) => item?.nameAr)
                .join(", ") || "",
              mealItem?.data?.allergens
                ?.map((item: IAllergens) => item?.nameEn)
                .join(", ") || ""
            )}
            column={3}
          />
          <AppItemView
            label='recipes.specification'
            value={
              <>
                {mealItem?.data?.isCold && (
                  <AppBoxBadge
                    label='recipes.isCold'
                    backgroundColor='#646405'
                  />
                )}
                {mealItem?.data?.isWarm && (
                  <AppBoxBadge
                    label='recipes.isWarm'
                    backgroundColor='#c91c1cbd'
                  />
                )}
                {mealItem?.data?.isDairyFree && (
                  <AppBoxBadge
                    label='ingredients.isDairyFree'
                    backgroundColor='#a5d060'
                  />
                )}
                {mealItem?.data?.isGlutenFree && (
                  <AppBoxBadge
                    label='ingredients.isGlutenFree'
                    backgroundColor='#71714c'
                  />
                )}
                {mealItem?.data?.isLowGI && (
                  <AppBoxBadge
                    label='ingredients.isLowGI'
                    backgroundColor='#4d9998'
                  />
                )}
                {!mealItem?.data?.isCold &&
                  !mealItem?.data?.isWarm &&
                  !mealItem?.data?.isDairyFree &&
                  !mealItem?.data?.isGlutenFree &&
                  !mealItem?.data?.isLowGI &&
                  "-"}
              </>
            }
            column={12}
          />
          <AppItemView
            label='meals.isAddOn'
            value={mealItem?.data?.isAddOn}
            type='isExist'
            column={3}
          />
          <AppItemView
            label='recipes.suitableForFreezing'
            value={mealItem?.data?.suitableForFreezing}
            type='isExist'
            column={3}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={mealItem?.data?.imageUrl}
            column={3}
          />
          <AppItemView
            label='common.status'
            value={mealItem?.data?.isActive}
            column={3}
            type='isActive'
          />
        </Grid>
      </BaseProfileDetails>
    </>
  );
};

export default MealDetailsProfile;

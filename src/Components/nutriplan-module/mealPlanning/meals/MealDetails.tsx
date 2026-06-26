/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetMealQuery } from "src/pages/nutriplan-module/mealPlanning/meals/services/api";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";

interface IMealDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MealDetails = (props: IMealDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: mealItem, isLoading: detailsLoading } = useGetMealQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && mealItem?.data?.nameEn!
            ? `- ${mealItem?.data?.nameEn!}`
            : `- ${mealItem?.data?.nameAr!}`
        }
        label='meals.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={mealItem?.data as IMeals}
        maxWidth='md'
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
            value={mealItem?.data?.priceForCustomer}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.weightInGrams'
            value={mealItem?.data?.weightInGrams}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.calories'
            value={mealItem?.data?.calories}
            column={3}
          />{" "}
          <AppItemView
            label='dailyMenuMeals.fat'
            value={mealItem?.data?.fat}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.carbs'
            value={mealItem?.data?.carbs}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.protein'
            value={mealItem?.data?.protein}
            column={3}
          />
          <AppItemView
            label='dailyMenuMeals.water'
            value={mealItem?.data?.water}
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
      </BaseDetails>
    </>
  );
};

export default MealDetails;

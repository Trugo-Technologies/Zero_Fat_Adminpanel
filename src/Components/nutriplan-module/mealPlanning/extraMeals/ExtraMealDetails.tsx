/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { useGetExtraMealQuery } from "src/pages/nutriplan-module/mealPlanning/extraMeals/services/api";
import { IExtraMeal } from "src/types/modules/nutriplan/extras";

interface IExtraMealDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ExtraMealDetails = (props: IExtraMealDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: extraMealItem, isLoading: detailsLoading } =
    useGetExtraMealQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && extraMealItem?.data?.nameEn!
            ? `- ${extraMealItem?.data?.nameEn!}`
            : `- ${extraMealItem?.data?.nameAr!}`
        }
        label='meals.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={extraMealItem?.data as IExtraMeal}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={extraMealItem?.data?.nameAr}
            column={3}
          />
          <AppItemView
            label='common.nameEn'
            value={extraMealItem?.data?.nameEn}
            column={3}
          />
          <AppItemView
            label='ingredients.price'
            value={extraMealItem?.data?.price}
            column={3}
          />
          <AppItemView
            label='recipeIngredients.amount'
            value={extraMealItem?.data?.amount}
            column={3}
          />

          <AppItemView
            label='dailyMenuMeals.weightInGrams'
            value={extraMealItem?.data?.weightInGrams}
            column={3}
          />
          <AppItemView
            label='ingredients.name'
            value={getValueBasedOnCurrentLanguage(
              extraMealItem?.data?.ingredient?.nameAr!,
              extraMealItem?.data?.ingredient?.nameEn!
            )}
            column={3}
          />
          <AppItemView
            label='orginalIngredients.name'
            value={getValueBasedOnCurrentLanguage(
              extraMealItem?.data?.orginalIngredient?.nameAr!,
              extraMealItem?.data?.orginalIngredient?.nameEn!
            )}
            column={3}
          />

          <AppItemView
            type='image'
            label='common.image'
            value={extraMealItem?.data?.imageUrl}
            column={3}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default ExtraMealDetails;

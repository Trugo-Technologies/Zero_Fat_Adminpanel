/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetCustomizationOptionQuery } from "src/pages/nutriplan-module/mealPlanning/customizationOptions/services/api";
import { ICustomizationOption } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const CustomizationOptionsDetails = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: customizationOptionsItem, isLoading: detailsLoading } =
    useGetCustomizationOptionQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <BaseDetails
      itemName={
        locale == "en-US" && customizationOptionsItem?.data?.nameEn!
          ? `- ${customizationOptionsItem?.data?.nameEn!}`
          : `- ${customizationOptionsItem?.data?.nameAr!}`
      }
      label='customizationOptions.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={detailsLoading}
      errorMessage={""}
      moreDetails={customizationOptionsItem?.data as ICustomizationOption}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView
          label='common.nameAr'
          value={customizationOptionsItem?.data?.nameAr}
          column={6}
        />
        <AppItemView
          label='common.nameEn'
          value={customizationOptionsItem?.data?.nameEn}
          column={6}
        />

        <AppItemView
          label='ingredients.name'
          value={getValueBasedOnCurrentLanguage(
            customizationOptionsItem?.data?.ingredient?.nameAr!,
            customizationOptionsItem?.data?.ingredient?.nameEn!
          )}
          column={6}
        />

        <AppItemView
          label='customizationGroups.name'
          value={getValueBasedOnCurrentLanguage(
            customizationOptionsItem?.data?.group?.nameAr!,
            customizationOptionsItem?.data?.group?.nameEn!
          )}
          column={6}
        />

        <AppItemView
          label='customizationOptions.isAllMeals'
          value={!customizationOptionsItem?.data?.meal}
          type='isExist'
          column={6}
        />

        {customizationOptionsItem?.data?.meal && (
          <AppItemView
            label='meal'
            value={getValueBasedOnCurrentLanguage(
              customizationOptionsItem?.data?.meal?.nameAr!,
              customizationOptionsItem?.data?.meal?.nameEn!
            )}
            column={6}
          />
        )}

        <AppItemView
          label='customizationOptions.isDefault'
          value={!customizationOptionsItem?.data?.isDefault}
          type='isExist'
          column={6}
        />

        <AppItemView
          label='customizationOptions.priceAdjustment'
          value={customizationOptionsItem?.data?.priceAdjustment}
          column={6}
        />

        <AppItemView
          label='customizationOptions.caloriesAdjustment'
          value={customizationOptionsItem?.data?.caloriesAdjustment}
          column={6}
        />

        <AppItemView
          label='customizationOptions.fatAdjustment'
          value={customizationOptionsItem?.data?.fatAdjustment}
          column={6}
        />

        <AppItemView
          label='customizationOptions.carbsAdjustment'
          value={customizationOptionsItem?.data?.carbsAdjustment}
          column={6}
        />
        <AppItemView
          label='customizationOptions.proteinAdjustment'
          value={customizationOptionsItem?.data?.proteinAdjustment}
          column={6}
        />

        <AppItemView
          type='image'
          label='common.image'
          value={customizationOptionsItem?.data?.imageUrl}
          column={6}
        />
      </Grid>
    </BaseDetails>
  );
};

export default CustomizationOptionsDetails;

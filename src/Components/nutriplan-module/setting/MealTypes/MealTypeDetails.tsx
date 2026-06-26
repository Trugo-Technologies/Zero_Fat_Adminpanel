/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetMealTypeQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";

interface IMealTypesDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MealTypeDetails = (props: IMealTypesDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: mealTypeItem,
    isLoading,
    error,
  } = useGetMealTypeQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && mealTypeItem?.data?.nameEn!
            ? `- ${mealTypeItem?.data?.nameEn!}`
            : `- ${mealTypeItem?.data?.nameAr!}`
        }
        label='mealTypes.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={mealTypeItem?.data as IMealTypes}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={mealTypeItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={mealTypeItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.icon'
            value={mealTypeItem?.data?.iconUrl}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={mealTypeItem?.data?.imageUrl}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default MealTypeDetails;

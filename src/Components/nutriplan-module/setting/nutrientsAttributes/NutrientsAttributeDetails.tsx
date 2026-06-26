/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetNutrientsAttributeQuery } from "src/pages/nutriplan-module/nutrientsAttributes/services/api";
import { INutrientsAttributes } from "src/types/modules/nutriplan/nutrientsAttributes";

interface INutrientsAttributeDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const NutrientsAttributeDetails = (props: INutrientsAttributeDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: nutrientsAttributeItem,
    isLoading,
    error,
  } = useGetNutrientsAttributeQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && nutrientsAttributeItem?.data?.nameEn!
            ? `- ${nutrientsAttributeItem?.data?.nameEn!}`
            : `- ${nutrientsAttributeItem?.data?.nameAr!}`
        }
        label='nutrientsAttributes.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={nutrientsAttributeItem?.data as INutrientsAttributes}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={nutrientsAttributeItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={nutrientsAttributeItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            label='nutrientsAttributes.unit'
            value={nutrientsAttributeItem?.data?.unit}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default NutrientsAttributeDetails;

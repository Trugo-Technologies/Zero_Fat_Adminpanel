/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetCustomizePricingByIdQuery } from "src/pages/nutriplan-module/mealPlanning/customizePricing/services/api";
import {
  ICustomizePricingTier,
  mapCustomizePricingApiToUi,
} from "src/types/modules/nutriplan/customizePricing";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  item: ICustomizePricingTier;
}

const CustomizePricingDetails = ({
  showDetails,
  setShowDetails,
  item,
}: IProps) => {
  const { messages } = useIntl();
  const { data, isFetching } = useGetCustomizePricingByIdQuery(
    { id: item.id },
    { skip: !item.id || !showDetails }
  );

  const row = data?.data ? mapCustomizePricingApiToUi(data.data) : item;

  return (
    <BaseDetails
      itemName={`${row.macroType} ${row.fromGrams}-${row.toGrams}g`}
      label='customizePricing.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isFetching}
      errorMessage={undefined}
      moreDetails={row as any}
      maxWidth='sm'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView
          label='customizePricing.macroType'
          value={
            (messages[`customizePricing.macro.${row.macroType}`] as string) ||
            row.macroType
          }
          column={6}
        />
        <AppItemView
          label='customizePricing.range'
          value={`${row.fromGrams} – ${row.toGrams} g`}
          column={6}
        />
        <AppItemView
          label='customizePricing.price'
          value={Number(row.price || 0).toLocaleString()}
          column={6}
        />
        {/* Meal plan / meal type temporarily hidden */}
        <AppItemView
          label='common.status'
          value={row.isActive}
          column={6}
          type='isActive'
        />
      </Grid>
    </BaseDetails>
  );
};

export default CustomizePricingDetails;

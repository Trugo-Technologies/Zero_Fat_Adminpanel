/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetCustomizationGroupQuery } from "src/pages/nutriplan-module/mealPlanning/customizationGroups/services/api";
import { ICustomizationGroup } from "src/types/modules/nutriplan/mealPlanning/customizationGroups";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const CustomizationGroupsDetails = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: customizationGroupItem, isLoading: detailsLoading } =
    useGetCustomizationGroupQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <BaseDetails
      itemName={
        locale == "en-US" && customizationGroupItem?.data?.nameEn!
          ? `- ${customizationGroupItem?.data?.nameEn!}`
          : `- ${customizationGroupItem?.data?.nameAr!}`
      }
      label='customizationGroups.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={detailsLoading}
      errorMessage={""}
      moreDetails={customizationGroupItem?.data as ICustomizationGroup}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView
          label='common.nameAr'
          value={customizationGroupItem?.data?.nameAr}
          column={6}
        />
        <AppItemView
          label='common.nameEn'
          value={customizationGroupItem?.data?.nameEn}
          column={6}
        />
        <AppItemView
          label='customizationGroups.displayOrder'
          value={customizationGroupItem?.data?.displayOrder}
          column={6}
        />

        <AppItemView
          label='customizationGroups.caloriesAdjustment'
          value={customizationGroupItem?.data?.caloriesAdjustment}
          column={6}
        />
        <AppItemView
          label='customizationGroups.fatAdjustment'
          value={customizationGroupItem?.data?.fatAdjustment}
          column={6}
        />
        <AppItemView
          label='customizationGroups.carbsAdjustment'
          value={customizationGroupItem?.data?.carbsAdjustment}
          column={6}
        />
        <AppItemView
          label='customizationGroups.proteinAdjustment'
          value={customizationGroupItem?.data?.proteinAdjustment}
          column={6}
        />

        <AppItemView
          label='customizationGroups.isRequired'
          value={customizationGroupItem?.data?.isRequired}
          type='isExist'
          column={6}
        />

        <AppItemView
          type='image'
          label='common.image'
          value={customizationGroupItem?.data?.imageUrl}
          column={6}
        />
      </Grid>
    </BaseDetails>
  );
};

export default CustomizationGroupsDetails;

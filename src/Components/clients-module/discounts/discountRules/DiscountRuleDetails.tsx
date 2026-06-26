/** @format */

import { Grid } from "@mui/material";
import DurationBadge from "src/Components/baseComponents/badge/DurationBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetDiscountRuleByIdQuery } from "src/pages/clients-module/discounts/discountRules/services/api";
import { IDiscountRule } from "src/types/modules/clientsManagement/discounts/discountRules";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const DiscountRuleDetails = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const {
    data: itemById,
    isLoading,
    error,
  } = useGetDiscountRuleByIdQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  return (
    <BaseDetails
      itemName={""}
      label='discountRules.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isLoading}
      errorMessage={error}
      moreDetails={itemById?.data as IDiscountRule}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView
          label='discountRules.code'
          value={itemById?.data?.code}
          column={6}
        />
        <AppItemView
          label='common.startDate'
          value={itemById?.data?.startDate}
          column={6}
        />

        <AppItemView
          label='discountRules.expirationDate'
          value={itemById?.data?.expirationDate}
          column={6}
        />
        <AppItemView
          label='discountRules.percentOff'
          value={itemById?.data?.percentOff}
          column={6}
        />
        <AppItemView
          label='discountRules.amountOff'
          value={itemById?.data?.amountOff}
          column={6}
        />

        <AppItemView
          label='discountRules.duration'
          value={<DurationBadge label={itemById?.data?.duration!} />}
          column={6}
        />
        <AppItemView
          label='discountRules.durationInMonths'
          value={itemById?.data?.durationInMonths}
          column={6}
        />

        <AppItemView
          label='discountRules.firstTimeClientsOnly'
          value={itemById?.data?.firstTimeClientsOnly}
          column={6}
          type='isExist'
        />

        <AppItemView
          label='menus.isPublished'
          value={!!itemById?.data?.stripeId}
          column={6}
          type='isExist'
        />

        <AppItemView
          label='discountRules.maxRedemptions'
          value={itemById?.data?.maxRedemptions}
          column={6}
        />

        <AppItemView
          label='discountRules.maxRedemptionsPerClient'
          value={itemById?.data?.maxRedemptionsPerClient}
          column={6}
        />

        <AppItemView
          label='common.status'
          value={itemById?.data?.isActive}
          column={6}
          type='isActive'
        />

        <AppItemView
          label='common.descriptionAr'
          value={itemById?.data?.descriptionAr}
          column={6}
        />
        <AppItemView
          label='common.descriptionEn'
          value={itemById?.data?.descriptionEn}
          column={6}
        />
      </Grid>
    </BaseDetails>
  );
};

export default DiscountRuleDetails;

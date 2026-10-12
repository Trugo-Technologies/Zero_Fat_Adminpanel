/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import DurationBadge from "src/Components/baseComponents/badge/DurationBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import {
  getBankNames,
  getPlanNames,
  getSubscriptionTypeNames,
} from "src/pages/clients-module/discounts/promoCodes/mockData";
import { IPromoCode } from "src/types/modules/clientsManagement/discounts/promoCodes";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  item: IPromoCode;
}

const PromoCodeDetails = (props: IProps) => {
  const { showDetails, setShowDetails, item } = props;
  const { messages, locale } = useIntl();

  return (
    <BaseDetails
      itemName={item.code}
      label='promoCodes.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={false}
      errorMessage={undefined}
      moreDetails={item}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView label='promoCodes.code' value={item.code} column={6} />
        <AppItemView
          label='common.startDate'
          value={item.startDate}
          column={6}
        />
        <AppItemView
          label='promoCodes.expirationDate'
          value={item.expirationDate}
          column={6}
        />
        <AppItemView
          label='promoCodes.applyMode'
          value={
            (messages[`promoCodes.applyMode.${item.applyMode}`] as string) ||
            item.applyMode
          }
          column={6}
        />
        <AppItemView
          label='promoCodes.eligibilityType'
          value={
            (messages[
              `promoCodes.eligibilityType.${item.eligibilityType}`
            ] as string) || item.eligibilityType
          }
          column={6}
        />
        <AppItemView
          label='promoCodes.rewardType'
          value={
            (messages[`promoCodes.rewardType.${item.rewardType}`] as string) ||
            item.rewardType
          }
          column={6}
        />
        <AppItemView
          label='promoCodes.percentOff'
          value={item.percentOff}
          column={6}
        />
        <AppItemView
          label='promoCodes.amountOff'
          value={item.amountOff}
          column={6}
        />
        <AppItemView
          label='promoCodes.buyQuantity'
          value={item.buyQuantity ?? "-"}
          column={6}
        />
        <AppItemView
          label='promoCodes.getQuantity'
          value={item.getQuantity ?? "-"}
          column={6}
        />
        <AppItemView
          label='promoCodes.minOrderCredits'
          value={item.minOrderCredits ?? "-"}
          column={6}
        />
        <AppItemView
          label='promoCodes.banks'
          value={getBankNames(item.bankIds || [], locale)}
          column={6}
        />
        <AppItemView
          label='promoCodes.plans'
          value={getPlanNames(item.planIds || [], locale)}
          column={6}
        />
        <AppItemView
          label='promoCodes.subscriptionTypes'
          value={getSubscriptionTypeNames(item.subscriptionTypes || [], locale)}
          column={6}
        />
        <AppItemView
          label='promoCodes.duration'
          value={<DurationBadge label={item.duration} />}
          column={6}
        />
        <AppItemView
          label='promoCodes.durationInMonths'
          value={item.durationInMonths}
          column={6}
        />
        <AppItemView
          label='menus.isPublished'
          value={!!item.stripeId || !!item.isPublished}
          column={6}
          type='isExist'
        />
        <AppItemView
          label='promoCodes.maxRedemptions'
          value={item.maxRedemptions}
          column={6}
        />
        <AppItemView
          label='promoCodes.maxRedemptionsPerClient'
          value={item.maxRedemptionsPerClient}
          column={6}
        />
        <AppItemView
          label='common.status'
          value={item.isActive}
          column={6}
          type='isActive'
        />
        <AppItemView
          label='common.descriptionAr'
          value={item.descriptionAr}
          column={6}
        />
        <AppItemView
          label='common.descriptionEn'
          value={item.descriptionEn}
          column={6}
        />
      </Grid>
    </BaseDetails>
  );
};

export default PromoCodeDetails;

/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import SubscriptionModuleBadge from "src/Components/baseComponents/badge/SubscriptionModuleBadge";
import SubscriptionTypeBadge from "src/Components/baseComponents/badge/SubscriptionTypeBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetSubscriptionPlanQuery } from "src/pages/core-module/subscriptionPlans/services/api";
import { ISubscriptionPlan } from "src/types/modules/core/subscriptionPlans";

interface ISubscriptionPlanDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const SubscriptionPlanDetails = (props: ISubscriptionPlanDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: subscriptionPlanItem, isLoading: detailsLoading } =
    useGetSubscriptionPlanQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && subscriptionPlanItem?.data?.titleEn!
            ? `- ${subscriptionPlanItem?.data?.titleEn!}`
            : `- ${subscriptionPlanItem?.data?.titleAr!}`
        }
        label='subscriptionPlans.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={subscriptionPlanItem?.data as ISubscriptionPlan}
        maxWidth='md'
        columns={12}
        withoutSecoundTab={true}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.titleAr'
            value={subscriptionPlanItem?.data?.titleAr}
            column={4}
          />
          <AppItemView
            label='common.titleEn'
            value={subscriptionPlanItem?.data?.titleEn}
            column={4}
          />
          <AppItemView
            label='subscriptionPlans.subscriptionType'
            value={
              <SubscriptionTypeBadge
                label={subscriptionPlanItem?.data?.subscriptionType!}
              />
            }
            column={4}
          />
          <AppItemView
            label='subscriptionPlans.minimumOrderValue'
            value={subscriptionPlanItem?.data?.minimumOrderValue}
            column={4}
          />
          <AppItemView
            label='subscriptionPlans.percentageDiscount'
            value={subscriptionPlanItem?.data?.percentageDiscount}
            column={4}
          />
          <AppItemView
            label='subscriptionPlans.subscriptionModule'
            value={
              <SubscriptionModuleBadge
                label={subscriptionPlanItem?.data?.subscriptionModule!}
              />
            }
            column={4}
          />
          <AppItemView
            label='subscriptionPlans.discountAmount'
            value={subscriptionPlanItem?.data?.discountAmount}
            column={4}
          />

          <AppItemView
            label='subscriptionPlans.paymob'
            value={subscriptionPlanItem?.data?.paymob}
            column={4}
          />

          <AppItemView
            label='common.status'
            value={subscriptionPlanItem?.data?.isActive}
            column={4}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default SubscriptionPlanDetails;

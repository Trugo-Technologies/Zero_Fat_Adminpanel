/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import DurationBadge from "src/Components/baseComponents/badge/DurationBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetDiscountRuleByIdQuery } from "src/pages/clients-module/discounts/discountRules/services/api";
import { useGetActiveMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import {
  DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS,
  IDiscountRule,
} from "src/types/modules/clientsManagement/discounts/discountRules";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const DiscountRuleDetails = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { messages, locale } = useIntl();
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
  const { data: mealPlansResponse } = useGetActiveMealPlansQuery();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  const mealPlanName = (() => {
    const mealPlanId = itemById?.data?.mealPlanId;
    if (!mealPlanId) return "-";
    const plan = (mealPlansResponse?.data || []).find(
      (p) => p.id === mealPlanId
    );
    if (!plan) return mealPlanId;
    return locale === "en-US" ? plan.nameEn : plan.nameAr;
  })();

  const bankName = (() => {
    const data = itemById?.data;
    if (!data?.bankId) return "-";
    if (locale === "en-US") {
      return data.bankNameEn || data.bankId;
    }
    return data.bankNameAr || data.bankNameEn || data.bankId;
  })();

  const subscriptionTypesLabel = (() => {
    const types = itemById?.data?.subscriptionTypes || [];
    if (!types.length) {
      return t("discountRules.subscriptionTypes.all", "All subscription types");
    }
    return types
      .map((type) => {
        const opt = DISCOUNT_SUBSCRIPTION_TYPE_OPTIONS.find(
          (o) => o.value === type
        );
        return opt ? t(opt.labelKey, type) : type;
      })
      .join(", ");
  })();

  const offerTypeLabel = itemById?.data?.offerType
    ? t(
        `discountRules.offerType.${itemById.data.offerType}`,
        String(itemById.data.offerType)
      )
    : "-";

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
          label='discountRules.offerType'
          value={offerTypeLabel}
          column={6}
        />
        <AppItemView
          label='discountRules.code'
          value={itemById?.data?.code}
          column={6}
        />
        <AppItemView
          label='discountRules.bank'
          value={bankName}
          column={6}
        />
        <AppItemView
          label='discountRules.mealPlan'
          value={mealPlanName}
          column={6}
        />
        <AppItemView
          label='discountRules.subscriptionTypes'
          value={subscriptionTypesLabel}
          column={12}
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
          label='discountRules.addToOffers'
          value={!!itemById?.data?.addToOffers}
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

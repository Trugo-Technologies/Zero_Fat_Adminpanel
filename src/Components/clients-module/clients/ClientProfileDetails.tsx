/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import BaseProfileDetails from "src/Components/baseComponents/profile/BaseProfileDetails";
import { IClientDetails } from "src/types/modules/clientsManagement/clients";
import GenderBadge from "src/Components/baseComponents/badge/GenderBadge";
import DietitianGoalBadge from "src/Components/baseComponents/badge/DietitianGoalBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
interface IClientProfileDetailsProps {
  clientItem: IClientDetails;
}

const ClientProfileDetails = (props: IClientProfileDetailsProps) => {
  const { clientItem } = props;
  const { locale, messages } = useIntl();

  return (
    <>
      <BaseProfileDetails
        moreDetails={clientItem as IClientDetails}
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.fullName'
            value={clientItem?.data?.fullName}
            column={3}
          />
          <AppItemView
            label='common.birthDate'
            value={clientItem?.data?.birthDate}
            column={3}
            type='date'
          />

          <AppItemView
            label='common.gender'
            value={<GenderBadge label={clientItem?.data?.gender!} />}
            column={3}
          />

          <AppItemView
            label='common.email'
            value={clientItem?.data?.email}
            column={3}
          />

          <AppItemView
            label='common.mobile'
            value={clientItem?.data?.mobile}
            column={3}
            type='isPhoneNumber'
          />

          <AppItemView
            label='physicalActivityLevels.activityValue'
            value={clientItem?.data?.activityValue}
            column={3}
          />

          <AppItemView
            label='clinets.dietitianGoal'
            value={
              <DietitianGoalBadge label={clientItem?.data?.dietitianGoal!} />
            }
            column={3}
          />

          <AppItemView
            label='dailyMenuMeals.fat'
            value={clientItem?.data?.bodyFat}
            column={3}
          />

          <AppItemView
            label='clinets.heightInCM'
            value={clientItem?.data?.heightInCM}
            column={3}
          />

          <AppItemView
            label='clinets.weightInKG'
            value={clientItem?.data?.weightInKG}
            column={3}
          />

          <AppItemView
            label='clinets.targetWeightInKG'
            value={clientItem?.data?.targetWeightInKG}
            column={3}
          />

          <AppItemView
            label='clinets.neededCaloriesToReachGoal'
            value={clientItem?.data?.neededCaloriesToReachGoal}
            column={4}
          />

          <AppItemView
            label='clinets.timeToReachGoalInDays'
            value={clientItem?.data?.timeToReachGoalInDays}
            column={4}
          />

          <AppItemView
            label='clinets.tdee'
            value={clientItem?.data?.tdee}
            column={4}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={clientItem?.data?.imageUrl}
            column={3}
          />
          <AppItemView
            label='clinets.bmi'
            value={clientItem?.data?.bmi}
            column={3}
          />

          <AppItemView
            label='clinets.bmr'
            value={clientItem?.data?.bmr}
            column={3}
          />

          <AppItemView
            label='clients.subscriptionStatus'
            value={
              <SubscriptionBadge
                label={clientItem?.data?.subscriptionStatus!}
              />
            }
            column={3}
          />

          <AppItemView
            label='sidebar.allergens'
            value={getValueBasedOnCurrentLanguage(
              clientItem?.data?.clientAllergics
                ?.map((item) => item?.nameAr)
                .join(", ") || "",
              clientItem?.data?.clientAllergics
                ?.map((item) => item?.nameEn)
                .join(", ") || ""
            )}
            column={12}
          />

          <AppItemView
            label='common.status'
            value={clientItem?.data?.isActive}
            column={12}
            type='isActive'
          />
        </Grid>
      </BaseProfileDetails>
    </>
  );
};

export default ClientProfileDetails;

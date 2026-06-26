/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import DietitianGoalBadge from "src/Components/baseComponents/badge/DietitianGoalBadge";
import GenderBadge from "src/Components/baseComponents/badge/GenderBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import ClientLocationsPages from "src/pages/clients-module/clientLocations";
import { useGetClientQuery } from "src/pages/clients-module/clients/services/api";
import { IClient } from "src/types/modules/clientsManagement/clients";

interface IClientDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ClientDetails = (props: IClientDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: clientItem,
    isLoading,
    error,
  } = useGetClientQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && clientItem?.data?.fullName!
            ? `- ${clientItem?.data?.fullName!}`
            : `- ${clientItem?.data?.fullName!}`
        }
        label='clients.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={clientItem?.data as IClient}
        maxWidth='md'
        columns={12}
        //ClientLocationsPages
        children={<></>}
        tabs={[
          {
            id: "1",
            label: "details",
            component: (
              <>
                <Grid container spacing={5} item xs={12}>
                  <AppItemView
                    label='common.fullNameAr'
                    value={clientItem?.data?.fullName}
                    column={3}
                  />
                  <AppItemView
                    label='common.fullNameEn'
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
                      <DietitianGoalBadge
                        label={clientItem?.data?.dietitianGoal!}
                      />
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
              </>
            ),
          },
          {
            id: "2",
            label: "clientLocations.name",
            component: (
              <>
                <ClientLocationsPages clientItem={clientItem?.data!} />
              </>
            ),
          },

          {
            id: "3",
            label: "additionalInfo",
            component: <AppMoreDetails moreDetails={clientItem?.data!} />,
          },
        ]}
      />
    </>
  );
};

export default ClientDetails;

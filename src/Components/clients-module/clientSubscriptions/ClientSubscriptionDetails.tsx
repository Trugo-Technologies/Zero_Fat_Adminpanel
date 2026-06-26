/** @format */

import { Chip, Divider, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import PaymentStatusBadge from "src/Components/baseComponents/badge/PaymentStatusBadge";
import PreferredDeliveryTimeBadge from "src/Components/baseComponents/badge/PreferredDeliveryTimeBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
import SubscriptionTypeBadge from "src/Components/baseComponents/badge/SubscriptionTypeBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetClientSubscriptionQuery } from "src/pages/clients-module/clientSubscriptions/services/api";
import {
  IClientSubscriptions,
  ISelectedMealTypes,
} from "src/types/modules/clientsManagement/clientSubscriptions";

interface IClientSubscriptionDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ClientSubscriptionDetails = (props: IClientSubscriptionDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const { data: clientSubscriptionItem, isLoading: detailsLoading } =
    useGetClientSubscriptionQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );

  const daysOfWeek = [
    messages["common.days.Sunday"],
    messages["common.days.Monday"],
    messages["common.days.Tuesday"],
    messages["common.days.Wednesday"],
    messages["common.days.Thursday"],
    messages["common.days.Friday"],
    messages["common.days.Saturday"],
  ];

  const getDayString = (dayNumber: number) => {
    return daysOfWeek[dayNumber];
  };

  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && clientSubscriptionItem?.data?.client?.fullName!
            ? `- ${clientSubscriptionItem?.data?.client?.fullName!}`
            : `- ${clientSubscriptionItem?.data?.client?.fullName!}`
        }
        label='clientSubscriptions.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={clientSubscriptionItem?.data as IClientSubscriptions}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='clients.name'
            value={getValueBasedOnCurrentLanguage(
              clientSubscriptionItem?.data?.client?.fullName!,
              clientSubscriptionItem?.data?.client?.fullName!
            )}
            column={3}
          />
          <AppItemView
            label='mealPlans.name'
            value={getValueBasedOnCurrentLanguage(
              clientSubscriptionItem?.data?.mealPlan?.nameAr!,
              clientSubscriptionItem?.data?.mealPlan?.nameEn!
            )}
            column={3}
          />
          <AppItemView
            label='sidebar.mealTypes'
            value={getValueBasedOnCurrentLanguage(
              clientSubscriptionItem?.data?.selectedMealTypes
                ?.map(
                  (item: ISelectedMealTypes) =>
                    `${item?.mealType?.nameAr} (${item?.quantityPerDay})`
                )
                .join(", ") || "",
              clientSubscriptionItem?.data?.selectedMealTypes
                ?.map(
                  (item: ISelectedMealTypes) =>
                    `${item?.mealType?.nameEn} (${item?.quantityPerDay})`
                )
                .join(", ") || ""
            )}
            column={3}
          />
          <AppItemView
            label='mealPlans.averageCalories'
            value={clientSubscriptionItem?.data?.averageCalories}
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus.preferredDeliveryTime'
            value={
              <PreferredDeliveryTimeBadge
                label={clientSubscriptionItem?.data?.preferredDeliveryTime!}
              />
            }
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus.selectedDeliveryDays'
            value={
              clientSubscriptionItem?.data?.selectedDeliveryDays
                ? clientSubscriptionItem?.data?.selectedDeliveryDays
                    ?.map(getDayString)
                    .join(", ")
                : "-"
            }
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus.cancelAt'
            value={clientSubscriptionItem?.data?.cancelAt}
            type='date'
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus.paymentDate'
            value={clientSubscriptionItem?.data?.paymentDate}
            type='date'
            column={3}
          />
          <AppItemView
            label='common.startDate'
            value={clientSubscriptionItem?.data?.startDate}
            type='date'
            column={3}
          />
          <AppItemView
            label='common.endDate'
            value={clientSubscriptionItem?.data?.endDate}
            type='date'
            column={3}
          />
          <AppItemView
            label='clientSubscriptions.lastSyncDate'
            value={clientSubscriptionItem?.data?.lastSyncDate}
            type='date'
            column={3}
          />

          <AppItemView
            label='clientSubscriptions.lastStatusUpdate'
            value={clientSubscriptionItem?.data?.lastStatusUpdate}
            type='date'
            column={3}
          />

          <AppItemView
            label='clients.subscriptionStatus.nextRenewalDate'
            value={clientSubscriptionItem?.data?.nextRenewalDate}
            type='date'
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus.renewalCount'
            value={clientSubscriptionItem?.data?.renewalCount}
            type='date'
            column={3}
          />
          <AppItemView
            label='payments.lastDeliveryDate'
            value={clientSubscriptionItem?.data?.lastDeliveryDate}
            type='dateTime'
            column={3}
          />
          <AppItemView
            label='subscriptionPlans.subscriptionType'
            value={
              <SubscriptionTypeBadge
                label={clientSubscriptionItem?.data?.subscriptionType!}
              />
            }
            column={3}
          />
          <AppItemView
            label='payments.totalCost'
            value={clientSubscriptionItem?.data?.totalCost}
            column={3}
          />
          <AppItemView
            label='client.ClientSubscription.isAutoRenewalEnabled'
            value={clientSubscriptionItem?.data?.isAutoRenewalEnabled}
            type='isExist'
            column={3}
          />
          <AppItemView
            label='clients.subscriptionStatus'
            value={
              <SubscriptionBadge
                label={clientSubscriptionItem?.data?.subscriptionStatus!}
              />
            }
            column={3}
          />
          <AppItemView
            label='subscriptionPlans.paymentQuickLink'
            value={
              clientSubscriptionItem?.data?.paymentQuickLink ? (
                <a
                  target='_blank'
                  href={clientSubscriptionItem?.data?.paymentQuickLink}>
                  {messages["clickHere"] as string}
                </a>
              ) : (
                "-"
              )
            }
            column={3}
          />
          <AppItemView
            label='payments.paymentStatus'
            value={
              <PaymentStatusBadge
                label={clientSubscriptionItem?.data?.paymentStatus!}
              />
            }
            column={3}
          />

          <Grid item my={4} xs={12}>
            <Divider
              sx={{
                color: "#a5d060",
                fontWeight: Fonts.SEMI_BOLD,
              }}
              variant='fullWidth'>
              {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
              <Chip
                label={messages["sidebar.clientLocation"] as string}
                size='medium'
                color='primary'
                sx={{ fontSize: 17 }}
              />
            </Divider>
          </Grid>
          {/* client location */}
          <AppItemView
            label='clientLocations.fullAddressAr'
            value={clientSubscriptionItem?.data?.clientLocation?.fullAddressAr}
            column={3}
          />
          <AppItemView
            label='clientLocations.fullAddressEn'
            value={clientSubscriptionItem?.data?.clientLocation?.fullAddressEn}
            column={3}
          />
          <AppItemView
            label='clientLocations.type'
            value={clientSubscriptionItem?.data?.clientLocation?.type}
            column={3}
          />
          <AppItemView
            label='clientLocations.area'
            value={clientSubscriptionItem?.data?.clientLocation?.area}
            column={3}
          />
          <AppItemView
            label='clientLocations.building'
            value={clientSubscriptionItem?.data?.clientLocation?.building}
            column={3}
          />
          <AppItemView
            label='clientLocations.postalCode'
            value={clientSubscriptionItem?.data?.clientLocation?.postalCode}
            column={3}
          />
          <AppItemView
            label='clientLocations.office'
            value={clientSubscriptionItem?.data?.clientLocation?.office}
            column={3}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default ClientSubscriptionDetails;

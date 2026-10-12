/** @format */

import {
  Box,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  SwitchProps,
  Typography,
  Zoom,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import PaymentStatusBadge from "src/Components/baseComponents/badge/PaymentStatusBadge";
import PreferredDeliveryTimeBadge from "src/Components/baseComponents/badge/PreferredDeliveryTimeBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
import SubscriptionTypeBadge from "src/Components/baseComponents/badge/SubscriptionTypeBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { showSuccessToasts } from "src/Components/toasts";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import {
  useActivateClientSubscriptionMutation,
  useGetClientSubscriptionQuery,
} from "src/pages/clients-module/clientSubscriptions/services/api";
import { subscriptionStatus } from "src/types/enums";
import {
  IClientSubscriptions,
  ISelectedMealTypes,
} from "src/types/modules/clientsManagement/clientSubscriptions";

const ActivateSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 15,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(23px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 11,
    height: 11,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "red" : "",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

interface IClientSubscriptionDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ClientSubscriptionDetails = (props: IClientSubscriptionDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);

  const { data: clientSubscriptionItem, isLoading: detailsLoading } =
    useGetClientSubscriptionQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );

  const [activateSubscription, { isLoading: isActivating }] =
    useActivateClientSubscriptionMutation();

  const status = clientSubscriptionItem?.data?.subscriptionStatus;
  const isActive = status === subscriptionStatus.Active;
  const canActivateManually = !!id && !isActive;

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

  const handleActivateConfirm = async () => {
    if (!id) return;
    try {
      await activateSubscription(id).unwrap();
      showSuccessToasts(
        (messages["clientSubscriptions.activateSuccess"] as string) ||
          "Subscription activated successfully"
      );
      setShowActivateConfirm(false);
    } catch {
      // Errors handled in mutation / toast
    }
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

          <Grid item xs={3}>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
              <IntlMessages id='clientSubscriptions.activateManually' />
            </Typography>
            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <ActivateSwitch
                  name='activateSubscription'
                  sx={{ m: 1 }}
                  checked={isActive}
                  disabled={!canActivateManually || isActivating}
                  onChange={(event) => {
                    if (event.target.checked && canActivateManually) {
                      setShowActivateConfirm(true);
                    }
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", minWidth: 70 }}>
                  <Zoom in={true}>
                    <p style={{ marginInline: "5px" }}>
                      <IntlMessages id='clientSubscriptions.activate' />
                    </p>
                  </Zoom>
                </Box>
              }
            />
          </Grid>

          <Grid item my={4} xs={12}>
            <Divider
              sx={{
                color: "#a5d060",
                fontWeight: Fonts.SEMI_BOLD,
              }}
              variant='fullWidth'>
              <Chip
                label={messages["sidebar.clientLocation"] as string}
                size='medium'
                color='primary'
                sx={{ fontSize: 17 }}
              />
            </Divider>
          </Grid>
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

      {showActivateConfirm && (
        <AppConfirmModal
          dialogTitle='clientSubscriptions.activateTitle'
          open={showActivateConfirm}
          setOpen={setShowActivateConfirm}
          loading={isActivating}
          itemName={clientSubscriptionItem?.data?.client?.fullName || ""}
          title='clientSubscriptions.activateContent'
          onConfirm={handleActivateConfirm}
        />
      )}
    </>
  );
};

export default ClientSubscriptionDetails;

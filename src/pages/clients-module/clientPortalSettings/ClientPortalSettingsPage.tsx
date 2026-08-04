/** @format */

import { Card, CardContent, Chip, Divider, Grid } from "@mui/material";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import { useIntl } from "react-intl";
import { useGetClientPortalSettingsQuery } from "./services/api";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { Fonts } from "src/@crema/constants/AppEnums";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import { useState } from "react";
import EditClientPortalSettings from "src/Components/clients-module/clientPortalSettings/EditClientPortalSettings";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { formatCutoffTimeDisplay } from "src/pages/clients-module/clientAccountAccess/deliveryCutoff";

function ClientPortalSettingsPage() {
  const { messages } = useIntl();
  const {
    data: clientPortalSettingsItem,
    isLoading,
    error,
  } = useGetClientPortalSettingsQuery({});

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
          currentPathName={"sidebar.clientPortalSettings"}
          withStatus
          StatusComponent={
            <>
              <AppButton
                label={"common.edit"}
                onClick={() => {
                  setShowEditModal(true);
                }}
              />
            </>
          }
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <LoadingAndErrorWrapper isLoading={isLoading} errorMessage=''>
                <Grid item xs={12}>
                  <Grid container spacing={5} item xs={12}>
                    <AppItemView
                      label='clientPortalSettings.defaultNutriPlanTimeAvailable'
                      value={
                        clientPortalSettingsItem?.data
                          ?.defaultNutriPlanTimeAvailable
                      }
                      column={3}
                    />

                    <AppItemView
                      label='clientPortalSettings.weeklyCaloricDeficit'
                      value={
                        clientPortalSettingsItem?.data?.weeklyCaloricDeficit
                      }
                      column={3}
                    />

                    <AppItemView
                      label='clientPortalSettings.weeklyCaloricSurplus'
                      value={
                        clientPortalSettingsItem?.data?.weeklyCaloricSurplus
                      }
                      column={3}
                    />
                    <AppItemView
                      label='clientPortalSettings.nutriPlanStartegy'
                      value={
                        messages[
                          `clientPortalSettings.nutriPlanStartegy.${clientPortalSettingsItem?.data?.nutriPlanStartegy}`
                        ]
                      }
                      column={3}
                    />

                    <AppItemView
                      label='clientPortalSettings.onePointEqualInMoney'
                      value={
                        clientPortalSettingsItem?.data?.onePointEqualInMoney
                      }
                      column={3}
                    />

                    <Grid item xs={12}>
                      <Divider
                        sx={{
                          color: "#a5d060",
                          fontWeight: Fonts.SEMI_BOLD,
                        }}
                        variant='fullWidth'>
                        {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
                        <Chip
                          label={
                            messages[
                              "clientPortalSettings.subsciption"
                            ] as string
                          }
                          size='medium'
                          color='primary'
                          sx={{ fontSize: 17 }}
                        />
                      </Divider>
                    </Grid>

                    <AppItemView
                      label='clientPortalSettings.minimumSubsciption'
                      value={clientPortalSettingsItem?.data?.minimumSubsciption}
                      column={3}
                    />
                    <AppItemView
                      label='clientPortalSettings.monthlyPackageSubsciptionDiscount'
                      value={
                        clientPortalSettingsItem?.data
                          ?.monthlyPackageSubsciptionDiscount
                      }
                      column={4}
                    />

                    <AppItemView
                      label='clientPortalSettings.threeMonthlyPackageSubsciptionDiscount'
                      value={
                        clientPortalSettingsItem?.data
                          ?.threeMonthlyPackageSubsciptionDiscount
                      }
                      column={4}
                    />

                    <AppItemView
                      label='clientPortalSettings.offsetSubscriptionInDays'
                      value={
                        clientPortalSettingsItem?.data?.offsetSubscriptionInDays
                      }
                      column={4}
                    />

                    <AppItemView
                      label='clientPortalSettings.cutoffTime'
                      value={formatCutoffTimeDisplay(
                        clientPortalSettingsItem?.data?.cutoffTime
                      )}
                      column={4}
                    />
                  </Grid>
                </Grid>
              </LoadingAndErrorWrapper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showEditModal && (
        <>
          <EditClientPortalSettings
            label='clientPortalSettings.edit'
            setShowEditModal={setShowEditModal}
            showEditModal={showEditModal}
          />
        </>
      )}
    </>
  );
}

export default ClientPortalSettingsPage;

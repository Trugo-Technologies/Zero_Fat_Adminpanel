/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import DailySelectionsStatusBadge from "src/Components/baseComponents/badge/DailySelectionsStatusBadge";
import PreferredMealTimeBadge from "src/Components/baseComponents/badge/PreferredMealTimeBadge";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetDailySelectionQuery } from "src/pages/clients-module/dailySelections/services/api";
import { IDailySelections } from "src/types/modules/clientsManagement/dailySelections";

interface IDailySelectionsDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const DailySelectionsDetails = (props: IDailySelectionsDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const { data: dailySelectionsItem, isLoading: detailsLoading } =
    useGetDailySelectionQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <>
      <BaseDetails
        itemName={dailySelectionsItem?.data?.client?.fullName || ""}
        label='dailySelections.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={dailySelectionsItem?.data as IDailySelections}
        maxWidth='md'
        columns={12}
        tabs={[
          {
            id: "1",
            label: "details",
            component: (
              <Grid container spacing={5} item xs={12}>
                <Grid item container xs={12}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #000",
                    }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000",
                          }}>
                          <IntlMessages id='sidebar.mealTypes' />
                        </th>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000",
                          }}>
                          <IntlMessages id='sidebar.kitchen.orderedMeal' />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailySelectionsItem?.data?.mealTypes?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                fontSize: 14,
                                fontWeight: Fonts.REGULAR,
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000",
                              }}>
                              {getValueBasedOnCurrentLanguage(
                                item?.nameAr,
                                item?.nameEn
                              )}
                            </td>
                            <td
                              style={{
                                fontSize: 14,
                                fontWeight: Fonts.REGULAR,
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000",
                              }}>
                              {item?.dailyMealSelections?.map(
                                (itemDailyMeal, dailyIndex) => (
                                  <span key={dailyIndex}>
                                    {getValueBasedOnCurrentLanguage(
                                      itemDailyMeal?.meal?.nameAr,
                                      itemDailyMeal?.meal?.nameEn
                                    )}
                                    {dailyIndex <
                                    item.dailyMealSelections.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </Grid>
                <AppItemView
                  label='clients.name'
                  value={dailySelectionsItem?.data?.client?.fullName}
                  column={3}
                />

                <AppItemView
                  label='common.mobile'
                  value={dailySelectionsItem?.data?.client?.mobile}
                  column={3}
                />

                <AppItemView
                  label='dailyMenuMeals.calories'
                  value={Number(
                    dailySelectionsItem?.data?.totalCalories
                  ).toFixed(0)}
                  column={3}
                />

                <AppItemView
                  label='dailyMenuMeals.fat'
                  value={Number(dailySelectionsItem?.data?.totalFats).toFixed(
                    0
                  )}
                  column={3}
                />

                <AppItemView
                  label='dailyMenuMeals.carbs'
                  value={Number(
                    dailySelectionsItem?.data?.totalCarbohydrates
                  ).toFixed(0)}
                  column={3}
                />

                <AppItemView
                  label='dailyMenuMeals.protein'
                  value={Number(
                    dailySelectionsItem?.data?.totalProteins
                  ).toFixed(0)}
                  column={3}
                />

                <AppItemView
                  label='dailySelections.dailySelectionStatus.hasCutlery'
                  value={dailySelectionsItem?.data?.hasCutlery}
                  column={3}
                  type='isExist'
                />

                <AppItemView
                  label='dailySelections.date'
                  value={dailySelectionsItem?.data?.date}
                  type='date'
                  column={3}
                />

                <AppItemView
                  label='dailySelections.deliveryTime'
                  value={
                    <PreferredMealTimeBadge
                      label={dailySelectionsItem?.data?.deliveryTime!}
                    />
                  }
                  column={3}
                />

                <AppItemView
                  label='dailySelections.dailySelectionStatus'
                  value={
                    <DailySelectionsStatusBadge
                      label={dailySelectionsItem?.data?.dailySelectionStatus!}
                    />
                  }
                  column={3}
                />
                <AppItemView
                  label='common.notes'
                  value={dailySelectionsItem?.data?.notes}
                  column={3}
                />
              </Grid>
            ),
          },

          {
            id: "2",
            label: "clientLocations.name",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='clientLocations.type'
                  value={
                    messages[
                      `clientLocations.type.${dailySelectionsItem?.data?.clientLocation?.type}`
                    ] as string
                  }
                  column={3}
                />
                <AppItemView
                  label='clientLocations.area'
                  value={dailySelectionsItem?.data?.clientLocation?.area}
                  column={3}
                />
                <AppItemView
                  label='clientLocations.street'
                  value={dailySelectionsItem?.data?.clientLocation?.street}
                  column={3}
                />
                <AppItemView
                  label='clientLocations.building'
                  value={dailySelectionsItem?.data?.clientLocation?.building}
                  column={3}
                />
                <AppItemView
                  label='clientLocations.postalCode'
                  value={dailySelectionsItem?.data?.clientLocation?.postalCode}
                  column={3}
                />
                <AppItemView
                  label='clientLocations.office'
                  value={dailySelectionsItem?.data?.clientLocation?.office}
                  column={6}
                />

                <AppItemView
                  label='clientLocations.fullAddressAr'
                  value={
                    dailySelectionsItem?.data?.clientLocation?.fullAddressAr
                  }
                  column={6}
                />

                <AppItemView
                  label='clientLocations.fullAddressEn'
                  value={
                    dailySelectionsItem?.data?.clientLocation?.fullAddressEn
                  }
                  column={6}
                />
              </Grid>
            ),
          },

          {
            id: "3",
            label: "additionalInfo",
            component: (
              <AppMoreDetails moreDetails={dailySelectionsItem?.data!} />
            ),
          },
        ]}
        children={<></>}></BaseDetails>
    </>
  );
};

export default DailySelectionsDetails;

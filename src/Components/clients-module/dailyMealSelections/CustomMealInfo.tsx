/** @format */

import { Chip, Divider, Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { ICustomMeal } from "src/types/modules/clientsManagement/dailyMealSelections";

interface IProps {
  customMealInfo: ICustomMeal;
}

const CustomMealInfo = (props: IProps) => {
  const { customMealInfo } = props;

  const { messages } = useIntl();
  return (
    <Grid container spacing={5} item xs={12}>
      <AppItemView
        type='image'
        label='common.image'
        value={customMealInfo?.imageUrl}
        column={3}
      />
      <AppItemView
        label='common.nameAr'
        value={customMealInfo?.nameAr}
        column={3}
      />
      <AppItemView
        label='common.nameEn'
        value={customMealInfo?.nameEn}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.calories'
        value={customMealInfo?.totalCalories}
        column={3}
      />{" "}
      <AppItemView
        label='dailyMenuMeals.fat'
        value={customMealInfo?.totalFat}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.carbs'
        value={customMealInfo?.totalCarbs}
        column={3}
      />
      <AppItemView
        label='dailyMenuMeals.protein'
        value={customMealInfo?.totalProtein}
        column={3}
      />
      <AppItemView
        label='mealPlans.price'
        value={customMealInfo?.totalPrice}
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
            label={messages["selectedOptions.name"] as string}
            size='medium'
            color='primary'
            sx={{ fontSize: 17 }}
          />
        </Divider>
      </Grid>
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
                <IntlMessages id='common.name' />
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
                <IntlMessages id='groups.name' />
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
                <IntlMessages id='dailyMealSelections.qty' />
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
                <IntlMessages id='customizationOptions.priceAdjustment' />
              </th>
            </tr>
          </thead>
          <tbody>
            {customMealInfo?.selectedOptions?.map((item, index) => (
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
                    item?.option?.nameAr,
                    item?.option?.nameEn
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
                  {getValueBasedOnCurrentLanguage(
                    item?.option?.group?.nameAr,
                    item?.option?.group?.nameEn
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
                  {item?.quantity}
                </td>
                <td
                  style={{
                    fontSize: 14,
                    fontWeight: Fonts.REGULAR,
                    textAlign: "left",
                    padding: "8px",
                    border: "1px solid #000",
                  }}>
                  {item?.option?.priceAdjustment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Grid>
    </Grid>
  );
};

export default CustomMealInfo;

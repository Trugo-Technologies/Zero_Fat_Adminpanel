/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import { useGetMealPlanQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import MealPlanDefaultDietitianGoal from "src/Components/baseComponents/badge/MealPlanDefaultDietitianGoal";
import {
  isCustomizeMealPlanRow,
  mapMealPlanApiMacrosToForm,
} from "src/types/modules/nutriplan/mealPlans";

interface IMealPlanDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MealPlanDetails = (props: IMealPlanDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: mealPlanItem,
    isLoading,
    error,
  } = useGetMealPlanQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  const plan = mealPlanItem?.data;
  const isCustomize = isCustomizeMealPlanRow(plan);
  const macros = mapMealPlanApiMacrosToForm(plan);

  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && plan?.nameEn!
            ? `- ${plan?.nameEn!}`
            : `- ${plan?.nameAr!}`
        }
        label='mealPlans.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={plan as IWorkoutBodyPart}
        maxWidth='md'
        columns={12}
        tabs={[
          {
            id: "1",
            label: "details",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='common.nameAr'
                  value={plan?.nameAr}
                  column={3}
                />
                <AppItemView
                  label='common.nameEn'
                  value={plan?.nameEn}
                  column={3}
                />
                <AppItemView
                  label='common.code'
                  value={plan?.code}
                  column={3}
                />

                <AppItemView
                  label='mealPlans.defaultDietitianGoal'
                  value={
                    <MealPlanDefaultDietitianGoal
                      label={plan?.defaultDietitianGoal!}
                    />
                  }
                  column={3}
                />

                <AppItemView
                  type='image'
                  label='common.image'
                  value={plan?.imageUrl}
                  column={3}
                />

                <AppItemView
                  label='common.status'
                  value={plan?.isActive}
                  column={3}
                  type='isActive'
                />
              </Grid>
            ),
          },

          {
            id: "2",
            label: "trainers.additionalInfo",
            component: (
              <Grid container spacing={5} item xs={12}>
                {isCustomize ? (
                  <>
                    <AppItemView
                      label='mealPlans.customize.proteinGrams'
                      value={macros.protein.grams}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.customize.proteinCalories'
                      value={macros.protein.calories}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.customize.carbsGrams'
                      value={macros.carbs.grams}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.customize.carbsCalories'
                      value={macros.carbs.calories}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.customize.fiberGrams'
                      value={macros.fiber.grams}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.customize.fiberCalories'
                      value={macros.fiber.calories}
                      column={4}
                    />
                  </>
                ) : (
                  <>
                    <AppItemView
                      label='mealPlans.carbPercentage'
                      value={plan?.carbPercentage}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.proteinPercentage'
                      value={plan?.proteinPercentage}
                      column={4}
                    />
                    <AppItemView
                      label='mealPlans.fatPercentage'
                      value={plan?.fatPercentage}
                      column={4}
                    />
                  </>
                )}
                <AppItemView
                  label='sidebar.mealTypes'
                  value={getValueBasedOnCurrentLanguage(
                    plan?.mealPlanMealTypes
                      ?.map((item) => item?.mealType?.nameAr)
                      .join(", ") || "",
                    plan?.mealPlanMealTypes
                      ?.map((item) => item?.mealType?.nameEn)
                      .join(", ") || ""
                  )}
                  column={6}
                />
              </Grid>
            ),
          },

          {
            id: "3",
            label: "additionalInfo",
            component: <AppMoreDetails moreDetails={plan!} />,
          },
        ]}
        children={<></>}
      />
    </>
  );
};

export default MealPlanDetails;

/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import { useGetMealPlanQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import MealPlanDefaultDietitianGoal from "src/Components/baseComponents/badge/MealPlanDefaultDietitianGoal";
interface IMealPlanDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MealPlanDetails = (props: IMealPlanDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

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
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && mealPlanItem?.data?.nameEn!
            ? `- ${mealPlanItem?.data?.nameEn!}`
            : `- ${mealPlanItem?.data?.nameAr!}`
        }
        label='mealPlans.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={mealPlanItem?.data as IWorkoutBodyPart}
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
                  value={mealPlanItem?.data?.nameAr}
                  column={3}
                />
                <AppItemView
                  label='common.nameEn'
                  value={mealPlanItem?.data?.nameEn}
                  column={3}
                />
                <AppItemView
                  label='common.code'
                  value={mealPlanItem?.data?.code}
                  column={3}
                />

                <AppItemView
                  label='mealPlans.defaultDietitianGoal'
                  value={
                    <MealPlanDefaultDietitianGoal
                      label={mealPlanItem?.data?.defaultDietitianGoal!}
                    />
                  }
                  column={3}
                />

                {/* <AppItemView label='trainers.name' value={getValueBasedOnCurrentLanguage(mealPlanItem?.data?.trainer?.nameAr!, mealPlanItem?.data?.trainer?.nameEn!)} column={3} /> */}
                <AppItemView
                  type='image'
                  label='common.image'
                  value={mealPlanItem?.data?.imageUrl}
                  column={3}
                />

                <AppItemView
                  label='common.status'
                  value={mealPlanItem?.data?.isActive}
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
                <AppItemView
                  label='mealPlans.carbPercentage'
                  value={mealPlanItem?.data?.carbPercentage}
                  column={4}
                />
                <AppItemView
                  label='mealPlans.proteinPercentage'
                  value={mealPlanItem?.data?.proteinPercentage}
                  column={4}
                />
                <AppItemView
                  label='mealPlans.fatPercentage'
                  value={mealPlanItem?.data?.fatPercentage}
                  column={4}
                />
                <AppItemView
                  label='sidebar.mealTypes'
                  value={getValueBasedOnCurrentLanguage(
                    mealPlanItem?.data?.mealPlanMealTypes
                      ?.map((item) => item?.mealType?.nameAr)
                      .join(", ") || "",
                    mealPlanItem?.data?.mealPlanMealTypes
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
            component: <AppMoreDetails moreDetails={mealPlanItem?.data!} />,
          },
        ]}
        children={<></>}
      />
    </>
  );
};

export default MealPlanDetails;

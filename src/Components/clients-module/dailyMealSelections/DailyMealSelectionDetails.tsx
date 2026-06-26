/** @format */

import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import { useGetDailyMealSelectionQuery } from "src/pages/clients-module/dailyMealSelections/services/api";
import CustomMealInfo from "./CustomMealInfo";
import MealInfo from "./MealInfo";

interface IMealDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const DailyMealSelectionDetails = (props: IMealDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: item, isLoading: detailsLoading } =
    useGetDailyMealSelectionQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  const isCustom =
    item?.data?.mealSelectionType === "Custom" && item?.data?.customMeal;

  const getPopupName = () => {
    if (isCustom) {
      return locale == "en-US" && item?.data?.customMeal?.nameEn!
        ? `- ${item?.data?.customMeal?.nameEn!}`
        : `- ${item?.data?.customMeal?.nameAr!}`;
    } else {
      return locale == "en-US" && item?.data?.meal?.nameEn!
        ? `- ${item?.data?.meal?.nameEn!}`
        : `- ${item?.data?.meal?.nameAr!}`;
    }
  };
  return (
    <BaseDetails
      itemName={getPopupName()}
      label='dailyMealSelections.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={detailsLoading}
      errorMessage={""}
      moreDetails={item?.data as any}
      maxWidth='md'
      columns={12}>
      {isCustom ? (
        <CustomMealInfo customMealInfo={item?.data?.customMeal!} />
      ) : (
        <MealInfo mealInfo={item?.data?.meal!} />
      )}
    </BaseDetails>
  );
};

export default DailyMealSelectionDetails;

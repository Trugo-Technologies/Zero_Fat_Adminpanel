/** @format */

import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import { useGetIngredientsQuery } from "src/pages/nutriplan-module/ingredients/services/api";
import FoodEnergyDetails from "../ingredients/FoodEnergyDetails";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ItemFoodEnergy = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();
  const {
    data: ingredientItem,
    isLoading,
    error,
  } = useGetIngredientsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  return (
    <BaseDetails
      itemName={
        locale == "en-US" && ingredientItem?.data?.nameEn!
          ? `- ${ingredientItem?.data?.nameEn!}`
          : `- ${ingredientItem?.data?.nameAr!}`
      }
      label='ingredients.foodEnergy'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isLoading}
      errorMessage={error}
      maxWidth='md'
      columns={12}>
      {ingredientItem?.data && (
        <FoodEnergyDetails data={ingredientItem?.data} />
      )}
    </BaseDetails>
  );
};

export default ItemFoodEnergy;

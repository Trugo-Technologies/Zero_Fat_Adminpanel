/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetEquipmentCategoryQuery } from "src/pages/workout-module/equipmentCategories/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

interface IEquipmentCategoryDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const EquipmentCategoryDetails = (props: IEquipmentCategoryDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: equipmentCategoryItem,
    isLoading,
    error,
  } = useGetEquipmentCategoryQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && equipmentCategoryItem?.data?.nameEn!
            ? `- ${equipmentCategoryItem?.data?.nameEn!}`
            : `- ${equipmentCategoryItem?.data?.nameAr!}`
        }
        label='equipmentCategories.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={equipmentCategoryItem?.data as IWorkoutBodyPart}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={equipmentCategoryItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={equipmentCategoryItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.icon'
            value={equipmentCategoryItem?.data?.iconUrl}
            column={6}
          />

          <AppItemView
            label='common.status'
            value={equipmentCategoryItem?.data?.isActive}
            column={6}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default EquipmentCategoryDetails;

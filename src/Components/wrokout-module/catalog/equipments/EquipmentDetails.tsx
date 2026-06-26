/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetEquipmentQuery } from "src/pages/workout-module/equipments/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

interface IEquipmentDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const EquipmentDetails = (props: IEquipmentDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: equipmentItem,
    isLoading,
    error,
  } = useGetEquipmentQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && equipmentItem?.data?.nameEn!
            ? `- ${equipmentItem?.data?.nameEn!}`
            : `- ${equipmentItem?.data?.nameAr!}`
        }
        label='equipments.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={equipmentItem?.data as IWorkoutBodyPart}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={equipmentItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={equipmentItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={equipmentItem?.data?.imageUrl}
            column={6}
          />
          <AppItemView
            label='common.status'
            value={equipmentItem?.data?.isActive}
            column={6}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default EquipmentDetails;

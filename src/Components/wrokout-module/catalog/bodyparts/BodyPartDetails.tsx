/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetBodyPartQuery } from "src/pages/workout-module/workoutBodyParts/services/api";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

interface IBodyPartDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const BodyPartDetails = (props: IBodyPartDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: bodyPartItem,
    isLoading,
    error,
  } = useGetBodyPartQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && bodyPartItem?.data?.nameEn!
            ? `- ${bodyPartItem?.data?.nameEn!}`
            : `- ${bodyPartItem?.data?.nameAr!}`
        }
        label='workoutBodyParts.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={bodyPartItem?.data as IWorkoutBodyPart}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={bodyPartItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={bodyPartItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            label='common.status'
            value={bodyPartItem?.data?.isActive}
            column={6}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default BodyPartDetails;

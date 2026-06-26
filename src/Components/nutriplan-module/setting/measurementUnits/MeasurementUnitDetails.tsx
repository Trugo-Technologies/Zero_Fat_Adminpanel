/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetMeasurementUnitQuery } from "src/pages/nutriplan-module/measurementUnits/services/api";
import { IMeasurmentUnits } from "src/types/modules/nutriplan/measurementUnits";

interface IBodyPartDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MeasurementUnitDetails = (props: IBodyPartDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: measurementUnitItem,
    isLoading,
    error,
  } = useGetMeasurementUnitQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && measurementUnitItem?.data?.nameEn!
            ? `- ${measurementUnitItem?.data?.nameEn!}`
            : `- ${measurementUnitItem?.data?.nameAr!}`
        }
        label='workoutBodyParts.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={measurementUnitItem?.data as IMeasurmentUnits}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={measurementUnitItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={measurementUnitItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            label='common.code'
            value={measurementUnitItem?.data?.code}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.icon'
            value={measurementUnitItem?.data?.iconUrl}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default MeasurementUnitDetails;

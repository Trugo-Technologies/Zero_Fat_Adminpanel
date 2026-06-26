/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { removeHTMLTags } from "src/Helpers";
import { useGetPhysicalActivityLevelsQuery } from "src/pages/core-module/physicalActivityLevels/services";
import { IPhysicalActivityLevels } from "src/types/modules/core/physicalActivityLevels";

interface IPhysicalActivityLevelDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const PhysicalActivityLevelDetails = (
  props: IPhysicalActivityLevelDetailsProps
) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: physicalActivityLevelItem,
    isLoading,
    error,
  } = useGetPhysicalActivityLevelsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && physicalActivityLevelItem?.data?.exampleEn!
            ? `- ${physicalActivityLevelItem?.data?.exampleEn!}`
            : `- ${physicalActivityLevelItem?.data?.exampleAr! ?? ""}`
        }
        label='physicalActivityLevels.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={physicalActivityLevelItem?.data as IPhysicalActivityLevels}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='physicalActivityLevels.exampleAr'
            value={physicalActivityLevelItem?.data?.exampleAr}
            column={6}
          />
          <AppItemView
            label='physicalActivityLevels.exampleEn'
            value={physicalActivityLevelItem?.data?.exampleEn}
            column={6}
          />

          <AppItemView
            label='physicalActivityLevels.activityValue'
            value={physicalActivityLevelItem?.data?.activityValue}
            column={6}
          />

          <AppItemView
            label='common.status'
            value={physicalActivityLevelItem?.data?.isActive}
            column={6}
            type='isActive'
          />

          <AppItemView
            type='image'
            label='common.image'
            value={physicalActivityLevelItem?.data?.imageUrl}
            column={6}
          />
          <Grid item xs={6} />

          <AppItemView
            label='common.descriptionAr'
            value={removeHTMLTags(
              physicalActivityLevelItem?.data?.descriptionAr! ?? ""
            )}
            column={6}
          />
          <AppItemView
            label='common.descriptionEn'
            value={removeHTMLTags(
              physicalActivityLevelItem?.data?.descriptionEn! ?? ""
            )}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default PhysicalActivityLevelDetails;

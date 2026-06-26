/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { removeHTMLTags } from "src/Helpers";
import { useGetAdvertisementsQuery } from "src/pages/core-module/advertisements/services";
import { IAdvertisements } from "src/types/modules/core/advertisements";

interface IAdvertisementDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const AdvertisementDetails = (props: IAdvertisementDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: advertisementItem,
    isLoading,
    error,
  } = useGetAdvertisementsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && advertisementItem?.data?.titleEn!
            ? `- ${advertisementItem?.data?.titleEn!}`
            : `- ${advertisementItem?.data?.titleAr!}`
        }
        label='advertisements.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={advertisementItem?.data as IAdvertisements}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.titleAr'
            value={advertisementItem?.data?.titleAr}
            column={6}
          />
          <AppItemView
            label='common.titleEn'
            value={advertisementItem?.data?.titleEn}
            column={6}
          />
          <AppItemView
            label='common.status'
            value={advertisementItem?.data?.isActive}
            column={6}
            type='isActive'
          />

          <AppItemView
            type='image'
            label='common.image'
            value={advertisementItem?.data?.imageUrl}
            column={6}
          />

          <AppItemView
            label='advertisements.welcomeMsgAr'
            value={removeHTMLTags(advertisementItem?.data?.welcomeMsgAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='advertisements.welcomeMsgEn'
            value={removeHTMLTags(advertisementItem?.data?.welcomeMsgEn! ?? "")}
            column={6}
          />

          <AppItemView
            label='common.descriptionAr'
            value={removeHTMLTags(
              advertisementItem?.data?.descriptionAr! ?? ""
            )}
            column={6}
          />
          <AppItemView
            label='common.descriptionEn'
            value={removeHTMLTags(
              advertisementItem?.data?.descriptionEn! ?? ""
            )}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default AdvertisementDetails;

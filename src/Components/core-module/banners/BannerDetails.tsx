/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetBannerQuery } from "src/pages/core-module/banners/services";
import { IBanner } from "src/types/modules/core/banners";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const BannerDetails = (props: IProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: bannerItem,
    isLoading,
    error,
  } = useGetBannerQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && bannerItem?.data?.titleEn!
            ? `- ${bannerItem?.data?.titleEn!}`
            : `- ${bannerItem?.data?.titleAr!}`
        }
        label='banners.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={bannerItem?.data as IBanner}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.titleAr'
            value={bannerItem?.data?.titleAr}
            column={6}
          />
          <AppItemView
            label='common.titleEn'
            value={bannerItem?.data?.titleEn}
            column={6}
          />
          <AppItemView
            label='common.status'
            value={bannerItem?.data?.isActive}
            column={6}
            type='isActive'
          />

          <AppItemView
            type='image'
            label='common.image'
            value={bannerItem?.data?.imageUrl}
            column={6}
          />

          <AppItemView
            label='common.descriptionAr'
            value={bannerItem?.data?.descriptionAr}
            column={6}
          />
          <AppItemView
            label='common.descriptionEn'
            value={bannerItem?.data?.descriptionEn}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default BannerDetails;

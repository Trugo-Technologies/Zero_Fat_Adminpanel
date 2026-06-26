/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { removeHTMLTags } from "src/Helpers";
import { useGetFaqCategoryQuery } from "src/pages/core-module/faqCategories/services";
import { IFaqCategories } from "src/types/modules/core/faqCategories";

interface IFaqCategoryDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const FaqCategoryDetails = (props: IFaqCategoryDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: faqcategoryItem,
    isLoading,
    error,
  } = useGetFaqCategoryQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && faqcategoryItem?.data?.nameEn!
            ? `- ${faqcategoryItem?.data?.nameEn!}`
            : `- ${faqcategoryItem?.data?.nameAr!}`
        }
        label='faqCategories.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={faqcategoryItem?.data as IFaqCategories}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={faqcategoryItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={faqcategoryItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            label='common.status'
            value={faqcategoryItem?.data?.isActive}
            column={12}
            type='isActive'
          />

          <AppItemView
            label='common.descriptionAr'
            value={removeHTMLTags(faqcategoryItem?.data?.descriptionAr! ?? "")}
            column={6}
          />
          <AppItemView
            label='common.descriptionEn'
            value={removeHTMLTags(faqcategoryItem?.data?.descriptionEn! ?? "")}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default FaqCategoryDetails;

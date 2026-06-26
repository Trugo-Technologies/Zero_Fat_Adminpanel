/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import CategoryBadge from "src/Components/baseComponents/badge/CategoryBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetCategoryQuery } from "src/pages/nutriplan-module/Categories/services/api";
import { ICategories } from "src/types/modules/nutriplan/categories";

interface ICategoryDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const CategoryDetails = (props: ICategoryDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: categoryItem,
    isLoading,
    error,
  } = useGetCategoryQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && categoryItem?.data?.nameEn!
            ? `- ${categoryItem?.data?.nameEn!}`
            : `- ${categoryItem?.data?.nameAr!}`
        }
        label='categories.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={categoryItem?.data as ICategories}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={categoryItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={categoryItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            label='categories.categoryType'
            value={<CategoryBadge label={categoryItem?.data?.categoryType!} />}
            column={6}
          />
          <Grid item xs={6} />
          <AppItemView
            type='image'
            label='common.icon'
            value={categoryItem?.data?.iconUrl}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.image'
            value={categoryItem?.data?.imageUrl}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default CategoryDetails;

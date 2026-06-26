/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetAllergensQuery } from "src/pages/nutriplan-module/Allergens/services/api";
import { IAllergens } from "src/types/modules/nutriplan/allergens";

interface IAllergenDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const AllergenDetails = (props: IAllergenDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: allergensItem,
    isLoading,
    error,
  } = useGetAllergensQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && allergensItem?.data?.nameEn!
            ? `- ${allergensItem?.data?.nameEn!}`
            : `- ${allergensItem?.data?.nameAr!}`
        }
        label='allergens.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={allergensItem?.data as IAllergens}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={allergensItem?.data?.nameAr}
            column={6}
          />
          <AppItemView
            label='common.nameEn'
            value={allergensItem?.data?.nameEn}
            column={6}
          />
          <AppItemView
            type='image'
            label='common.icon'
            value={allergensItem?.data?.iconUrl}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default AllergenDetails;

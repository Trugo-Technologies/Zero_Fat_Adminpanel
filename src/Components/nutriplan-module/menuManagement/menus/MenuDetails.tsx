/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetMenuQuery } from "src/pages/nutriplan-module/menuManagement/menus/services/api";
import { IMenus } from "src/types/modules/nutriplan/menuManagement/menus";

interface IMenuDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const MenuDetails = (props: IMenuDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const {
    data: menuItem,
    isLoading,
    error,
  } = useGetMenuQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && menuItem?.data?.nameEn!
            ? `- ${menuItem?.data?.nameEn!}`
            : `- ${menuItem?.data?.nameAr!}`
        }
        label='menus.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={menuItem?.data as IMenus}
        maxWidth='sm'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={menuItem?.data?.nameAr}
            column={4}
          />
          <AppItemView
            label='common.nameEn'
            value={menuItem?.data?.nameEn}
            column={4}
          />
          <AppItemView
            label='menus.isPublished'
            value={menuItem?.data?.isPublished}
            type='isExist'
            column={4}
          />

          <AppItemView
            label='common.startDate'
            value={menuItem?.data?.startDate}
            type='date'
            column={4}
          />

          <AppItemView
            label='common.endDate'
            value={menuItem?.data?.endDate}
            type='date'
            column={4}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default MenuDetails;

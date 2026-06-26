/** @format */

import { Grid } from "@mui/material";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetAdminQuery } from "src/pages/users-module/adminsManagement/admins/services/api";
interface IAdminDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  fullName: string;
  id: string;
}

const AdminDetails = (props: IAdminDetailsProps) => {
  const { setShowDetails, fullName, id } = props;

  const {
    data: adminItem,
    isLoading,
    error,
  } = useGetAdminQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );

  return (
    <BaseDetails
      itemName={fullName ? `- ${fullName}` : ""}
      label='admin.details'
      open={true}
      onClose={() => setShowDetails(false)}
      loading={isLoading}
      errorMessage={error}
      moreDetails={adminItem?.data}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView
          label={"common.imageUrl"}
          value={adminItem?.data?.imageUrl}
          type='image'
          column={4}
        />
        <AppItemView
          label='common.fullName'
          value={adminItem?.data?.fullName}
          column={4}
        />
        <AppItemView
          label='common.userName'
          value={adminItem?.data?.userName}
          column={4}
        />

        <AppItemView
          label='common.email'
          value={adminItem?.data?.email}
          column={4}
        />

        <AppItemView
          label='common.phoneNumber'
          value={adminItem?.data?.phoneNumber}
          column={4}
        />

        <AppItemView
          label='common.status'
          value={adminItem?.data?.isActive}
          column={4}
          type='isActive'
        />
      </Grid>
    </BaseDetails>
  );
};

export default AdminDetails;

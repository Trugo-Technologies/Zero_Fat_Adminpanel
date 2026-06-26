/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppGoogleMap from "src/Components/baseComponents/googleMap/AppGoogleMap";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetClientLocationDetailsQuery } from "src/pages/clients-module/clientLocations/services/api";
import { IClientLocations } from "src/types/modules/clientsManagement/clientLocations";

interface IClientLocationDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const ClientLocationDetails = (props: IClientLocationDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const { data: clientLocationItem, isLoading: detailsLoading } =
    useGetClientLocationDetailsQuery(
      { id: id || "" },
      {
        skip: !id,
      }
    );
  return (
    <>
      <BaseDetails
        itemName={""}
        label='clientLocations.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={clientLocationItem?.data as IClientLocations}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='clientLocations.type'
            value={
              messages[`clientLocations.type.${clientLocationItem?.data?.type}`]
            }
            column={3}
          />
          <AppItemView
            label='clientLocations.area'
            value={clientLocationItem?.data?.area}
            column={3}
          />
          <AppItemView
            label='clientLocations.street'
            value={clientLocationItem?.data?.street}
            column={3}
          />

          <AppItemView
            label='clientLocations.building'
            value={clientLocationItem?.data?.building}
            column={3}
          />
          <AppItemView
            label='clientLocations.flat'
            value={clientLocationItem?.data?.flat}
            column={3}
          />
          <AppItemView
            label='clientLocations.postalCode'
            value={clientLocationItem?.data?.postalCode}
            column={3}
          />

          <AppItemView
            label='clientLocations.block'
            value={clientLocationItem?.data?.block}
            column={3}
          />

          <AppItemView
            label='clientLocations.office'
            value={clientLocationItem?.data?.office}
            column={3}
          />
          <AppItemView
            label='clientLocations.fullAddressAr'
            value={clientLocationItem?.data?.fullAddressAr}
            column={6}
          />

          <AppItemView
            label='clientLocations.fullAddressEn'
            value={clientLocationItem?.data?.fullAddressEn}
            column={6}
          />

          <AppItemView
            label='clientLocations.notesFromClient'
            value={clientLocationItem?.data?.notesFromClient}
            column={6}
          />
          <AppItemView
            label='clientLocations.notesFromZeroFat'
            value={clientLocationItem?.data?.notesFromZeroFat}
            column={6}
          />
          <Grid item xs={12} sx={{ minHeight: 300 }}>
            <AppGoogleMap
              defaultLocation={{
                latitude: clientLocationItem?.data?.latitude!,
                longitude: clientLocationItem?.data?.longitude!,
              }}
            />
          </Grid>
        </Grid>
      </BaseDetails>
    </>
  );
};

export default ClientLocationDetails;

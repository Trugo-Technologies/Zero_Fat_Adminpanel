/** @format */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppGoogleMap from "src/Components/baseComponents/googleMap/AppGoogleMap";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { IClientLocations } from "src/types/modules/clientsManagement/clientLocations";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  name: string;
  clientLocation: IClientLocations;
}

const DailySelectionsLocation = (props: IProps) => {
  const { showModal, setShowModal, name, clientLocation } = props;
  const { messages } = useIntl();

  return (
    <Dialog
      fullWidth
      maxWidth={"md"}
      open={showModal}
      onClose={() => setShowModal(false)}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={"common.location"} />{" "}
          <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {" "}
            {name || ""}
          </span>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={5} item xs={12}>
          <Grid item xs={12} sx={{ minHeight: 300 }}>
            <AppGoogleMap
              defaultLocation={{
                latitude: clientLocation?.latitude || 0,
                longitude: clientLocation?.longitude || 0,
              }}
            />
          </Grid>

          <Grid container spacing={5} item xs={12}>
            <AppItemView
              label='clientLocations.type'
              value={
                messages[
                  `clientLocations.type.${clientLocation?.type}`
                ] as string
              }
              column={3}
            />
            <AppItemView
              label='clientLocations.area'
              value={clientLocation?.area}
              column={3}
            />
            <AppItemView
              label='clientLocations.street'
              value={clientLocation?.street}
              column={3}
            />
            <AppItemView
              label='clientLocations.building'
              value={clientLocation?.building}
              column={3}
            />
            <AppItemView
              label='clientLocations.postalCode'
              value={clientLocation?.postalCode}
              column={3}
            />
            <AppItemView
              label='clientLocations.office'
              value={clientLocation?.office}
              column={6}
            />

            <AppItemView
              label='clientLocations.fullAddressAr'
              value={clientLocation?.fullAddressAr}
              column={6}
            />

            <AppItemView
              label='clientLocations.fullAddressEn'
              value={clientLocation?.fullAddressEn}
              column={6}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <AppButton
          onClick={() => setShowModal(false)}
          color='secondary'
          label='common.cancel'
        />
      </DialogActions>
    </Dialog>
  );
};

export default DailySelectionsLocation;

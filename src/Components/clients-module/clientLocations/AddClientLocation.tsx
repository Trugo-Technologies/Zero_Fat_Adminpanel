/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import * as yup from "yup";
import { useAddClientLocationMutation } from "src/pages/clients-module/clientLocations/services/api";
import {
  IAddressDto,
  ICreateClientLocation,
} from "src/types/modules/clientsManagement/clientLocations";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppGoogleMap from "src/Components/baseComponents/googleMap/AppGoogleMap";

interface IAddClientLocationProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  clientId: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddClientLocation: React.FC<IAddClientLocationProps> = (props) => {
  const { showAddModal, setShowAddModal, label, clientId } = props;

  const [addClientLocationMethod, { isLoading: addLoading, isSuccess }] =
    useAddClientLocationMutation();
  const [currentLocation, setCurrentLocation] = useState<
    IAddressDto | undefined
  >({
    latitude: 33.5022498,
    longitude: 36.2561701,
  });

  const { messages } = useIntl();

  const validationSchema = yup.object({
    clientId: yup.string().required(String(messages["validation.required"])),
    fullAddressAr: yup
      .string()
      .required(String(messages["validation.required"])),
    fullAddressEn: yup
      .string()
      .required(String(messages["validation.required"])),
    area: yup.string().required(String(messages["validation.required"])),
    postalCode: yup.string().required(String(messages["validation.required"])),
  });
  const refForm = React.useRef<FormikProps<ICreateClientLocation>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <>
      <AppAddModal
        label={label}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        closeModalState={setShowAddModal}
        successClose={isSuccess}
        handleSubmit={submit}
        loadingForAdd={addLoading}
        maxWidth={"md"}>
        <Formik
          validateOnChange={true}
          initialValues={{
            clientId: clientId,
            area: "",
            block: "",
            building: "",
            flat: "",
            office: "",
            street: "",
            postalCode: "",
            type: "Home",
            fullAddressAr: "",
            fullAddressEn: "",
            notesFromClient: "",
            notesFromZeroFat: "",
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            const dataToSend = {
              ...data,
              latitude: currentLocation?.latitude || 0,
              longitude: currentLocation?.longitude || 0,
            };
            addClientLocationMethod(dataToSend);
          }}>
          {({ errors, setFieldValue, values }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={3}>
                  <AppSelectField
                    fullWidth
                    size='small'
                    name='type'
                    labelId='clientLocations.type'
                    label={messages["clientLocations.type"] as string}
                    error={Boolean(errors?.type)}>
                    <MenuItem value={"Home"}>
                      <IntlMessages id='clientLocations.type.Home' />
                    </MenuItem>
                    <MenuItem value={"Office"}>
                      <IntlMessages id='clientLocations.type.Office' />
                    </MenuItem>
                  </AppSelectField>
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.area' />}
                    name='area'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.building' />}
                    name='building'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.flat' />}
                    name='flat'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.street' />}
                    name='street'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.postalCode' />}
                    name='postalCode'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.block' />}
                    name='block'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.office' />}
                    name='office'
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.fullAddressAr' />}
                    name='fullAddressAr'
                    variant='outlined'
                    size='small'
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={<IntlMessages id='clientLocations.fullAddressEn' />}
                    name='fullAddressEn'
                    variant='outlined'
                    size='small'
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={
                      <IntlMessages id='clientLocations.notesFromClient' />
                    }
                    name='notesFromClient'
                    variant='outlined'
                    size='small'
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppTextField
                    label={
                      <IntlMessages id='clientLocations.notesFromZeroFat' />
                    }
                    name='notesFromZeroFat'
                    variant='outlined'
                    size='small'
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sx={{ minHeight: 300 }}>
                  <AppGoogleMap
                    currentLocation={currentLocation}
                    setCurrentLocation={setCurrentLocation}
                    draggable
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </AppAddModal>
    </>
  );
};

export default AddClientLocation;

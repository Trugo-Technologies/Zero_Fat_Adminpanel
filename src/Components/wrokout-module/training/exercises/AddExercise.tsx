/** @format */

import { Grid, MenuItem } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import AppUploadDocument from "src/Components/baseComponents/uploadFile/uploadDocument/AppUploadDocument";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useAddExerciseMutation } from "src/pages/workout-module/training-module/exercises/services/api";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { useGetAllWorkoutBodyPartsQuery } from "src/pages/workout-module/workoutBodyParts/services/api";
import { exerciseType } from "src/types/enums";
import { ICreateExerciseDto } from "src/types/modules/training/exercises";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import {
  IWorkoutBodyPart,
  IWorkoutBodyPartsListDto
} from "src/types/modules/workout/workoutBodyParts";
import * as yup from "yup";

interface IAddExerciseProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddExercise: React.FC<IAddExerciseProps> = (props) => {
  const { showAddModal, setShowAddModal, label } = props;

  const [addExerciseMethod, { isLoading: addLoading, isSuccess }] =
    useAddExerciseMutation();

  const {
    changePage,
    data,
    isFetching,
    page,
    setSearchValue,
    searchValue,
    refetch,
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const {
    changePage: changePageBodyParts,
    data: bodyPartsList,
    isError: isErrorBodyParts,
    isFetching: isFetchingBodyParts,
    page: pageBodyParts,
    setSearchValue: setSearchValueBodyParts,
    searchValue: searchValueBodyParts,
    refetch: refetchBodyParts,
  } = usePaginateData<IWorkoutBodyPartsListDto>(useGetAllWorkoutBodyPartsQuery);

  const { messages } = useIntl();

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    type: yup.string().required(String(messages["validation.required"])),
    avatarImage: yup.string().required(String(messages["validation.required"])),
    gif: yup.string().required(String(messages["validation.required"])),
    // trainerId: yup.string().required(String(messages['validation.required'])),
  });
  const refForm = React.useRef<FormikProps<ICreateExerciseDto>>(null);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (page && page > 1) refetch();
  }, [page]);

  useEffect(() => {
    if (pageBodyParts && pageBodyParts > 1) refetchBodyParts();
  }, [pageBodyParts]);

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
            nameAr: "",
            nameEn: "",
            type: "",
            bodyPartsIds: [],
            trainerId: "",
            instructionsAr: "",
            instructionsEn: "",
            avatarImage: "",
            gif: "",
            media: "",
            isActive: true,
          }}
          validationSchema={validationSchema}
          innerRef={refForm}
          onSubmit={async (data, { setSubmitting }) => {
            let dataToSend = { ...data };
            if (uploadedFiles) {
              dataToSend = { ...data, media: uploadedFiles[0] };
            }
            addExerciseMethod(appendToFormData(dataToSend));
          }}>
          {({ setFieldValue, errors, values, touched }) => {
            return (
              <Form>
                <Grid container spacing={4}>
                  <Grid item xs={4}>
                    <AppTextField
                      label={<IntlMessages id='common.nameAr' />}
                      name='nameAr'
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <AppTextField
                      label={<IntlMessages id='common.nameEn' />}
                      name='nameEn'
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <AppSelectField
                      fullWidth
                      size='small'
                      name='type'
                      labelId='exercises.type'
                      label={messages["exercises.type"] as string}
                      error={Boolean(errors?.type)}>
                      <MenuItem value={exerciseType.Reps}>
                        <IntlMessages id='exercises.type.Reps' />
                      </MenuItem>
                      <MenuItem value={exerciseType.WeightAndReps}>
                        <IntlMessages id='exercises.type.WeightAndReps' />
                      </MenuItem>
                      <MenuItem value={exerciseType.Duration}>
                        <IntlMessages id='exercises.type.Duration' />
                      </MenuItem>
                    </AppSelectField>
                  </Grid>
                  <Grid item xs={6}>
                    <AppBaseAutoComplete
                      label='trainers.name'
                      isLoading={isFetching}
                      options={data?.data}
                      hasNextPage={data?.hasNextPage}
                      pageNumber={page}
                      changePage={changePage}
                      onChangeAutoComplete={(event, value) => {
                        setFieldValue("trainerId", value ? value?.id : "");
                        changePage(1);
                      }}
                      searchText={searchValue}
                      onChangeTextField={(value) => {
                        setSearchValue(value.target.value);
                        changePage(1);
                      }}
                      error={errors.trainerId}
                      touched={touched.trainerId}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AppBaseAutoComplete
                      label='exercises.bodyParts'
                      isLoading={isFetchingBodyParts}
                      options={bodyPartsList?.data?.filter(
                        (part) => !values?.bodyPartsIds?.includes(part.id)
                      )}
                      hasNextPage={bodyPartsList?.hasNextPage}
                      pageNumber={pageBodyParts}
                      changePage={changePageBodyParts}
                      multiple
                      onChangeAutoComplete={(event, value) => {
                        setFieldValue(
                          "bodyPartsIds",
                          value
                            ? value?.map((item: IWorkoutBodyPart) => item?.id)
                            : ""
                        );
                        changePageBodyParts(1);
                      }}
                      searchText={searchValueBodyParts}
                      onChangeTextField={(value) => {
                        setSearchValueBodyParts(value.target.value);
                        changePageBodyParts(1);
                      }}
                      error={errors.bodyPartsIds}
                      touched={touched.bodyPartsIds}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <AppFreeEditor
                      name='instructionsAr'
                      label='exercises.instructionsAr'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AppFreeEditor
                      name='instructionsEn'
                      label='exercises.instructionsEn'
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"flex-start"}>
                    <AppCustomizedSwitch
                      keyName='isActive'
                      onChange={setFieldValue}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AppImageField
                      label={"common.avatarImage"}
                      name='avatarImage'
                      placeholder={""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AppImageField
                      label={"common.gif"}
                      name='gif'
                      placeholder={""}
                    />
                  </Grid>
                  <Grid item container xs={12}>
                    <AppUploadDocument
                      keyName='media'
                      uploadedFiles={uploadedFiles}
                      setUploadedFiles={setUploadedFiles}
                      uploadText='trainers.profileMedia'
                      formRef={refForm}
                      uploadModernXs={2}
                      appGridXs={6}
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </AppAddModal>
    </>
  );
};

export default AddExercise;

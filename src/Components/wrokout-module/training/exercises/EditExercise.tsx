/** @format */

import { Grid } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import AppUploadDocument from "src/Components/baseComponents/uploadFile/uploadDocument/AppUploadDocument";
import { baseImageUrl } from "src/env/base-url";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  useEditExerciseMutation,
  useGetExerciseQuery,
} from "src/pages/workout-module/training-module/exercises/services/api";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { useGetAllWorkoutBodyPartsQuery } from "src/pages/workout-module/workoutBodyParts/services/api";
import { ISelectedRow } from "src/types/baseEntity";
import { IUpdateExerciseDto } from "src/types/modules/training/exercises";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import {
  IWorkoutBodyPart,
  IWorkoutBodyPartsListDto,
} from "src/types/modules/workout/workoutBodyParts";
import * as yup from "yup";

interface IEditExerciseProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  selectedRow: ISelectedRow;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const EditExercise: React.FC<IEditExerciseProps> = (props) => {
  const { messages, locale } = useIntl();

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
    isFetching: isFetchingBodyParts,
    page: pageBodyParts,
    setSearchValue: setSearchValueBodyParts,
    searchValue: searchValueBodyParts,
    refetch: refetchBodyParts,
  } = usePaginateData<IWorkoutBodyPartsListDto>(useGetAllWorkoutBodyPartsQuery);

  const { showEditModal, setShowEditModal, label, selectedRow } = props;
  const { data: exerciseItem, isLoading: detailsLoading } = useGetExerciseQuery(
    { id: selectedRow?.id || "" },
    {
      skip: !selectedRow?.id,
    }
  );
  const [updateExercises, { isLoading: editLoading, isSuccess, error }] =
    useEditExerciseMutation();

  const refForm = React.useRef<FormikProps<IUpdateExerciseDto>>(null);

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    type: yup.string().required(String(messages["validation.required"])),
    avatarImage: yup.string().required(String(messages["validation.required"])),
    gif: yup.string().required(String(messages["validation.required"])),
    // trainerId: yup.string().required(String(messages['validation.required'])),
  });

  useEffect(() => {
    if (exerciseItem && exerciseItem?.data?.mediaUrl) {
      setUploadedFiles([
        {
          preview: `${baseImageUrl}/${exerciseItem?.data?.mediaUrl}`,
          orginalUrl: `${exerciseItem?.data?.mediaUrl}`,
        },
      ]);
    }
  }, [exerciseItem]);

  useEffect(() => {
    refForm.current?.setFieldValue("media", uploadedFiles);
  }, [uploadedFiles]);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };
  return (
    <AppEditModal
      label={label}
      itemName={
        locale == "en-US" && exerciseItem?.data?.nameEn!
          ? `- ${exerciseItem?.data?.nameEn!}`
          : `- ${exerciseItem?.data?.nameAr!}`
      }
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false);
      }}
      handleSubmit={submit}
      loading={detailsLoading}
      errorMessage={""}
      loadingForEdit={editLoading}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      maxWidth={"md"}>
      <Formik
        validateOnChange={true}
        initialValues={{
          id: selectedRow?.id || "",
          nameAr: exerciseItem?.data?.nameAr || "",
          nameEn: exerciseItem?.data?.nameEn || "",
          type: exerciseItem?.data?.type || "",
          bodyPartsIds: exerciseItem?.data?.bodyPartIds || [],
          trainerId: exerciseItem?.data?.trainerId || "",
          instructionsAr: exerciseItem?.data?.instructionsAr || "",
          instructionsEn: exerciseItem?.data?.instructionsEn || "",
          avatarImage: exerciseItem?.data?.avatarImageUrl || "",
          avatarImageUrl: exerciseItem?.data?.avatarImageUrl || "",
          gif: exerciseItem?.data?.gifUrl || "",
          gifUrl: exerciseItem?.data?.gifUrl || "",
          mediaUrl: exerciseItem?.data?.mediaUrl || "",

          isActive: exerciseItem?.data?.isActive || false,
        }}
        innerRef={refForm}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          // const formDataValue = appendToFormData(data);
          let dataToSend = { ...data };
          if (uploadedFiles[0].orginalUrl) {
            dataToSend = {
              ...data,
              mediaUrl: uploadedFiles[0].orginalUrl,
              media: null,
            };
          } else {
            dataToSend = {
              ...data,
              media: uploadedFiles[0],
              mediaUrl: null,
            };
          }
          updateExercises({
            id: selectedRow?.id,
            data: { ...dataToSend },
          });
        }}>
        {({ setFieldValue, values, errors, touched }) => (
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
                <AppBaseAutoComplete
                  label='trainers.name'
                  isLoading={isFetching}
                  options={data?.data}
                  defaultValue={exerciseItem?.data?.trainer}
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
              <Grid item xs={12}>
                <AppBaseAutoComplete
                  label='exercises.bodyParts'
                  isLoading={isFetchingBodyParts}
                  defaultValue={exerciseItem?.data?.bodyParts}
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

              <Grid item xs={12} display={"flex"} justifyContent={"flex-start"}>
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
                  uploadText='common.media'
                  formRef={refForm}
                  uploadModernXs={2}
                  appGridXs={6}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AppEditModal>
  );
};
export default EditExercise;

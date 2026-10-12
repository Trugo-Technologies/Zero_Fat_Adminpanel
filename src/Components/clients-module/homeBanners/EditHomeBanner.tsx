/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppEditModal from "src/Components/baseComponents/modals/AppEditModal";
import {
  useGetHomeBannerByIdQuery,
  useUpdateHomeBannerMutation,
} from "src/pages/clients-module/homeBanners/services/api";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import {
  buildHomeBannerFormData,
  getHomeBannerMealsPerDay,
  HomeBannerAudience,
  HomeBannerSubscriptionPlan,
  IHomeBanner,
  IHomeBannerFormValues,
  mapHomeBannerApiToUi,
} from "src/types/modules/clientsManagement/homeBanners";
import HomeBannerForm from "./HomeBannerForm";
import homeBannersValidationSchema from "./validation";

interface IProps {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: IHomeBanner;
}

const EditHomeBanner: React.FC<IProps> = ({
  showEditModal,
  setShowEditModal,
  selectedRow,
}) => {
  const refForm = React.useRef<FormikProps<IHomeBannerFormValues>>(null);
  const { messages } = useIntl();

  const { data: itemById, isLoading: detailsLoading } =
    useGetHomeBannerByIdQuery(
      { id: selectedRow.id },
      { skip: !selectedRow.id || !showEditModal }
    );

  const [updateHomeBanner, { isLoading, isSuccess }] =
    useUpdateHomeBannerMutation();

  const row = itemById?.data
    ? mapHomeBannerApiToUi(itemById.data)
    : selectedRow;

  const mealTypeSelections =
    row.mealTypeSelections?.length
      ? row.mealTypeSelections
      : (row.mealTypeIds || []).map((mealTypeId) => ({
          mealTypeId,
          quantityPerDay: 1,
        }));

  return (
    <AppEditModal
      label='homeBanners.edit'
      open={showEditModal}
      itemName={row.titleEn}
      errorMessage=''
      onClose={() => setShowEditModal(false)}
      closeModalState={setShowEditModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForEdit={isLoading}
      loading={detailsLoading}
      maxWidth='md'>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={{
          titleEn: row.titleEn,
          titleAr: row.titleAr,
          descriptionEn: row.descriptionEn,
          descriptionAr: row.descriptionAr,
          badgeTextEn: row.badgeTextEn,
          badgeTextAr: row.badgeTextAr,
          image: row.imageUrl || null,
          imageUrl: row.imageUrl || "",
          planIds: row.planIds || [],
          mealTypeSelections,
          mealTypeIds:
            mealTypeSelections.map((item) => item.mealTypeId) ||
            row.mealTypeIds ||
            [],
          subscriptionPlanType:
            row.subscriptionPlanType || HomeBannerSubscriptionPlan.OneMonth,
          mealsPerDay:
            getHomeBannerMealsPerDay(mealTypeSelections) ||
            row.mealsPerDay ||
            0,
          snacksPerDay: row.snacksPerDay ?? 0,
          durationDays: row.durationDays ?? 16,
          freeDelivery: row.freeDelivery ?? true,
          preferredDeliveryTime:
            row.preferredDeliveryTime || PreferredDeliveryTime.EarlyMorning,
          deliveryDays: (row.deliveryDays?.length
            ? row.deliveryDays
            : [1, 2, 3, 4, 5]
          ).filter((day) => day !== 6),
          audienceType: row.audienceType || HomeBannerAudience.All,
          originalPrice: row.originalPrice,
          salePrice: row.salePrice,
          currency: row.currency || "AED",
          sortOrder: row.sortOrder,
          isActive: row.isActive,
          proteinGrams:
            row.proteinGrams != null ? row.proteinGrams : "",
          carbsGrams: row.carbsGrams != null ? row.carbsGrams : "",
          fiberGrams: row.fiberGrams != null ? row.fiberGrams : "",
          _isCustomizePlan:
            row.proteinGrams != null || row.carbsGrams != null,
        }}
        validationSchema={homeBannersValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          updateHomeBanner({
            id: selectedRow.id,
            data: buildHomeBannerFormData(data, { id: selectedRow.id }),
          });
        }}>
        <HomeBannerForm />
      </Formik>
    </AppEditModal>
  );
};

export default EditHomeBanner;

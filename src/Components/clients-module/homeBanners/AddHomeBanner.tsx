/** @format */

import { Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppAddModal from "src/Components/baseComponents/modals/AppAddModal";
import { useCreateHomeBannerMutation } from "src/pages/clients-module/homeBanners/services/api";
import { PreferredDeliveryTime } from "src/types/modules/clientsManagement/clientSubscriptions";
import {
  buildHomeBannerFormData,
  HomeBannerAudience,
  HomeBannerSubscriptionPlan,
  IHomeBannerFormValues,
} from "src/types/modules/clientsManagement/homeBanners";
import HomeBannerForm from "./HomeBannerForm";
import homeBannersValidationSchema from "./validation";

interface IProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: IHomeBannerFormValues = {
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  badgeTextEn: "",
  badgeTextAr: "",
  image: null,
  imageUrl: "",
  planIds: [],
  mealTypeIds: [],
  mealTypeSelections: [],
  subscriptionPlanType: HomeBannerSubscriptionPlan.OneMonth,
  mealsPerDay: 0,
  snacksPerDay: 0,
  durationDays: 16,
  freeDelivery: true,
  preferredDeliveryTime: PreferredDeliveryTime.EarlyMorning,
  deliveryDays: [1, 2, 3, 4, 5],
  audienceType: HomeBannerAudience.All,
  originalPrice: "",
  salePrice: "",
  currency: "AED",
  sortOrder: 1,
  isActive: true,
  proteinGrams: "",
  carbsGrams: "",
  fiberGrams: "",
  _isCustomizePlan: false,
};

const AddHomeBanner: React.FC<IProps> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const refForm = React.useRef<FormikProps<IHomeBannerFormValues>>(null);
  const { messages } = useIntl();
  const [createHomeBanner, { isLoading, isSuccess }] =
    useCreateHomeBannerMutation();

  return (
    <AppAddModal
      label='homeBanners.add'
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      closeModalState={setShowAddModal}
      successClose={isSuccess}
      handleSubmit={() => refForm.current?.submitForm()}
      loadingForAdd={isLoading}
      maxWidth='md'>
      <Formik
        validateOnChange
        initialValues={defaultValues}
        validationSchema={homeBannersValidationSchema(messages)}
        innerRef={refForm}
        onSubmit={(data) => {
          createHomeBanner(buildHomeBannerFormData(data));
        }}>
        <HomeBannerForm />
      </Formik>
    </AppAddModal>
  );
};

export default AddHomeBanner;

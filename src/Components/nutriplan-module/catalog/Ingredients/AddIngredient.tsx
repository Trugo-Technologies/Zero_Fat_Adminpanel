/** @format */

import { FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import GenerateForm from "src/Components/generate-form-component";
import { appendToFormData } from "src/Helpers/append-to-form-data";
import { useGetAllAllergensQuery } from "src/pages/nutriplan-module/Allergens/services/api";
import { useGetAllCategoriesQuery } from "src/pages/nutriplan-module/Categories/services/api";
import AmountsTable from "src/pages/nutriplan-module/ingredients/component/AmountsTable";
import AttributesTable from "src/pages/nutriplan-module/ingredients/component/AttributesTable";
import BasicUnitType from "src/pages/nutriplan-module/ingredients/component/BasicUnitType";
import StorageInstructionsEditor from "src/pages/nutriplan-module/ingredients/component/StorageInstructionsEditor";
import { useAddIngredientsMutation } from "src/pages/nutriplan-module/ingredients/services/api";
import { useGetAllMeasurementUnitsQuery } from "src/pages/nutriplan-module/measurementUnits/services/api";
import { useGetAllNutrientsAttributesQuery } from "src/pages/nutriplan-module/nutrientsAttributes/services/api";
import { FormikOnSubmitType, inputType } from "src/types";
import { ICreateIngredientsDto } from "src/types/modules/nutriplan/Ingredients";
import * as yup from "yup";

interface IAddAllergenProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  onSuccess?: () => void;
  onFailed?: () => void;
}

const AddIngredient = () => {
  const navigate = useNavigate();
  const [addIngredients, { isLoading: addLoading, isSuccess }] =
    useAddIngredientsMutation();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllCategoriesQuery({
    categoryType: "Ingredient",
  });
  const {
    data: allergensData,
    isLoading: allergensLoading,
    isError: allergensError,
  } = useGetAllAllergensQuery({});
  const { isLoading: measurementUnitsLoading, isError: measurementUnitsError } =
    useGetAllMeasurementUnitsQuery({});
  const {
    isLoading: nutrientsAttributesLoading,
    isError: nutrientsAttributesError,
  } = useGetAllNutrientsAttributesQuery({});
  const isLoading =
    categoriesLoading ||
    allergensLoading ||
    measurementUnitsLoading ||
    nutrientsAttributesLoading;
  const isError =
    allergensError ||
    categoriesError ||
    measurementUnitsError ||
    nutrientsAttributesError;
  const CategoryList = categoriesData?.data?.map((element) => ({
    key: element.nameEn,
    value: element.id,
  }));
  const AllergensList = allergensData?.data?.map((element) => ({
    key: element.nameEn,
    value: element.id,
  }));
  const StatusList = [
    { key: "Available", value: "Available" },
    { key: "OutOfStock", value: "OutOfStock" },
    { key: "Discontinued", value: "Discontinued" },
  ];
  const DietaryPreferenceList = [
    { key: "Vegan", value: "Vegan" },
    { key: "Vegetarian", value: "Vegetarian" },
    { key: "NonVegetarian", value: "NonVegetarian" },
    { key: "Paleo", value: "Paleo" },
    { key: "Keto", value: "Keto" },
    { key: "None", value: "None" },
  ];
  const TypeList = [
    { key: "Vegetable", value: "Vegetable" },
    { key: "Fruit", value: "Fruit" },
    { key: "Meat", value: "Meat" },
    { key: "Dairy", value: "Dairy" },
    { key: "Grain", value: "Grain" },
    { key: "Nut", value: "Nut" },
    { key: "Other", value: "Other" },
  ];
  const { messages } = useIntl();
  const initialValues = {
    nameAr: "",
    nameEn: "",
    DescriptionAr: "",
    DescriptionEn: "",
    StorageInstructionsEn: "",
    StorageInstructionsAr: "",
    IsDairyFree: false,
    IsLowGI: false,
    IsSeasonal: false,
    IsOrganic: false,
    IsGlutenFree: false,
    CategoryId: "",
    BasicUnit: "",
    Density: 0,
    tags: [],
    CaloriesPer100Unit: 0,
    FatPer100Unit: 0,
    CarbsPer100Unit: 0,
    ProteinPer100Unit: 0,
    FiberPer100Unit: 0,
    SugarPer100Unit: 0,
    WaterPer100g: 0,
    CaloriesUnit: "",
    CostPer100Unit: 0,
    Status: "",
    DietaryPreference: "",
    Type: "",
    AllergenIds: [],
    ingredientMeasurementUnits: [
      { measurementUnitId: "", equivalentInUnit: 0 },
    ],
    attributes: [],
    AttributesObj: {},
    unit: "",
    unitNumber: 0,
    Price: 0,
  };
  const validtionNumber = yup
    .number()
    .required(String(messages["validation.required"]))
    .min(1, String(messages["validation.numberMoreThanZero"]));
  const validationArray = yup
    .array()
    .min(1, String(messages["validation.atLeastOneElementRequired"]))
    .required(String(messages["validation.required"]));

  const validationSchema = yup.object({
    nameAr: yup.string().required(String(messages["validation.required"])),
    nameEn: yup.string().required(String(messages["validation.required"])),
    unit: yup.string().required(String(messages["validation.required"])),
    Status: yup.string().required(String(messages["validation.required"])),
    StorageInstructionsEn: yup
      .string()
      .required(String(messages["validation.required"])),
    StorageInstructionsAr: yup
      .string()
      .required(String(messages["validation.required"])),
    DietaryPreference: yup
      .string()
      .required(String(messages["validation.required"])),
    Type: yup.string().required(String(messages["validation.required"])),
    CategoryId: yup.string().required(String(messages["validation.required"])),
    Price: validtionNumber,
    unitNumber: validtionNumber,
    CaloriesPer100Unit: validtionNumber,
    FatPer100Unit: validtionNumber,
    CarbsPer100Unit: validtionNumber,
    ProteinPer100Unit: validtionNumber,
    FiberPer100Unit: validtionNumber,
    SugarPer100Unit: validtionNumber,
    WaterPer100g: validtionNumber,
    Density: yup.number().when("BasicUnit", {
      is: (val: string) => val !== "Solid",
      then: () => validtionNumber,
      otherwise: () => yup.number().notRequired(),
    }),
    BasicUnit: yup.string().required(String(messages["validation.required"])),
    AllergenIds: validationArray,
    attributes: validationArray,
    tags: validationArray,
    CaloriesUnit: yup
      .string()
      .required(String(messages["validation.required"])),
    ingredientMeasurementUnits: yup.array().of(
      yup.object().shape({
        measurementUnitId: yup
          .string()
          .required(String(messages["validation.required"])),
        equivalentInUnit: validtionNumber,
      })
    ),
  });
  const refForm = React.useRef<FormikProps<ICreateIngredientsDto>>(null);
  const fields = [
    {
      inputType: inputType.text,
      name: "nameAr",
      label: "common.nameAr",
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.text,
      name: "nameEn",
      label: "common.nameEn",
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.text,
      name: "DescriptionAr",
      label: "common.DescriptionAr",
      md: 6,
      xs: 12,
      multiline: true,
      minRows: 3,
    },
    {
      inputType: inputType.text,
      name: "DescriptionEn",
      label: "common.DescriptionEn",
      md: 6,
      xs: 12,
      multiline: true,
      minRows: 3,
    },
    {
      inputType: inputType.custom,
      renderComponent: <StorageInstructionsEditor />,
      name: "",
      label: "",
      md: 12,
      xs: 12,
    },
    {
      inputType: inputType.custom,
      renderComponent: <AmountsTable />,
      name: "",
      label: "",
      md: 12,
      xs: 12,
    },
    {
      inputType: inputType.checkBox,
      name: "IsOrganic",
      label: "ingredients.IsOrganic",
      md: 2,
      xs: 4,
    },
    {
      inputType: inputType.checkBox,
      name: "IsSeasonal",
      label: "ingredients.IsSeasonal",
      md: 2,
      xs: 4,
    },
    {
      inputType: inputType.checkBox,
      name: "IsGlutenFree",
      label: "ingredients.IsGlutenFree",
      md: 2,
      xs: 4,
    },
    {
      inputType: inputType.checkBox,
      name: "IsDairyFree",
      label: "ingredients.IsDairyFree",
      md: 2,
      xs: 4,
    },
    {
      inputType: inputType.checkBox,
      name: "IsLowGI",
      label: "ingredients.IsLowGI",
      md: 2,
      xs: 4,
    },
    {
      inputType: inputType.select,
      name: "Status",
      label: "ingredients.Status",
      options: StatusList,
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.select,
      name: "DietaryPreference",
      label: "ingredients.DietaryPreference",
      options: DietaryPreferenceList,
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.select,
      name: "Type",
      label: "ingredients.Type",
      options: TypeList,
      md: 6,
      xs: 12,
    },

    {
      inputType: inputType.select,
      name: "CategoryId",
      label: "ingredients.CategoryId",
      options: CategoryList,
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.multiSelect,
      name: "AllergenIds",
      label: "ingredients.AllergenIds",
      options: AllergensList,
      md: 6,
      xs: 12,
    },
    {
      inputType: inputType.custom,
      renderComponent: <BasicUnitType />,
      name: "",
      label: "",
      md: 12,
    },
    {
      inputType: inputType.custom,
      renderComponent: <AttributesTable />,
      name: "",
      label: "",
      md: 12,
    },
    {
      inputType: inputType.custom,
      renderComponent: <></>,
      name: "",
      label: "",
      md: 12,
    },
  ];

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    { setSubmitting }
  ) => {
    const CostPer100Unit = values.Price / values.unitNumber;
    const newValues = values as Partial<typeof initialValues>;
    delete newValues.unit;
    delete newValues.unitNumber;
    delete newValues.AttributesObj;
    delete newValues.Price;
    return addIngredients(
      appendToFormData({
        ...newValues,
        Density: values.BasicUnit === "Solid" ? 1 : values.Density,
        CostPer100Unit: CostPer100Unit,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/nutriplan/catalog/ingredients");
      })
      .catch(() => {
        setSubmitting(false);
      });
  };
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.catalog.title"] },
            {
              name: messages["sidebar.ingredients"],
              path: "/nutriplan/catalog/ingredients",
            },
          ]}
          currentPathName={"ingredients.add"}
        />
      </div>
      <GenerateForm
        title={"ingredients.add"}
        isMultiLanguage={false}
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        isError={isError}
        loading={isLoading}
      />
    </>
  );
};

export default AddIngredient;

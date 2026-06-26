/** @format */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { serialize } from "object-to-formdata";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { createValidationSchemas } from "src/Components/nutriplan-module/mealPlanning/ingredients/validations";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllAllergensQuery } from "src/pages/nutriplan-module/Allergens/services/api";
import { useGetAllCategoriesQuery } from "src/pages/nutriplan-module/Categories/services/api";
import { useAddIngredientsMutation } from "src/pages/nutriplan-module/mealPlanning/ingredients/services/api";
import { useGetAllMeasurementUnitsQuery } from "src/pages/nutriplan-module/measurementUnits/services/api";
import { useGetAllNutrientsAttributesQuery } from "src/pages/nutriplan-module/nutrientsAttributes/services/api";
import {
  basicUnit,
  dietaryPreference,
  ingredientStatus,
  ingredientType,
} from "src/types/enums";
import {
  IAllergens,
  IAllergensListDto,
} from "src/types/modules/nutriplan/allergens";
import { ICategoriesListDto } from "src/types/modules/nutriplan/categories";
import { ICreateIngredientsDto } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import { IMeasurmentUnitsListDto } from "src/types/modules/nutriplan/measurementUnits";
import { INutrientsAttributesListDto } from "src/types/modules/nutriplan/nutrientsAttributes";
import { defaultValues } from "./defaultValues";
import IngredientQuantityField from "./IngredientQuantityField";

const AddIngredient = () => {
  const navigate = useNavigate();
  const { messages } = useIntl();
  const refForm = useRef<FormikProps<ICreateIngredientsDto>>(null);
  const { validationSchema } = createValidationSchemas(messages);

  const [addIngredientMethod, { isLoading: addLoading, isSuccess }] =
    useAddIngredientsMutation();

  const {
    changePage: changePageCategories,
    data: categoriesList,
    isFetching: isFetchingCategories,
    page: pageCategories,
    setSearchValue: setSearchValueCategories,
    searchValue: searchValueCategories,
    refetch: refetchCategories,
  } = usePaginateData<ICategoriesListDto>(
    useGetAllCategoriesQuery,
    {},
    {
      categoryType: "Ingredient",
    }
  );

  const {
    changePage: changePageAllergens,
    data: allergensList,
    isFetching: isFetchingAllergens,
    page: pageAllergens,
    setSearchValue: setSearchValueAllergens,
    searchValue: searchValueAllergens,
    refetch: refetchAllergens,
  } = usePaginateData<IAllergensListDto>(useGetAllAllergensQuery);

  const {
    changePage: changePageMeasurementUnits,
    data: measurementUnitsList,
    isFetching: isFetchingMeasurementUnits,
    page: pageMeasurementUnits,
    setSearchValue: setSearchValueMeasurementUnits,
    searchValue: searchValueMeasurementUnits,
    refetch: refetchMeasurementUnits,
  } = usePaginateData<IMeasurmentUnitsListDto>(useGetAllMeasurementUnitsQuery);

  const {
    changePage: changePageAttributes,
    data: attributesList,
    isFetching: isFetchingAttributes,
    page: pageAttributes,
    setSearchValue: setSearchValueAttributes,
    searchValue: searchValueAttributes,
    refetch: refetchAttributes,
  } = usePaginateData<INutrientsAttributesListDto>(
    useGetAllNutrientsAttributesQuery
  );

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (pageCategories && pageCategories > 1) refetchCategories();
  }, [pageCategories]);

  useEffect(() => {
    if (pageAllergens && pageAllergens > 1) refetchAllergens();
  }, [pageAllergens]);

  useEffect(() => {
    if (pageMeasurementUnits && pageMeasurementUnits > 1)
      refetchMeasurementUnits();
  }, [pageMeasurementUnits]);

  useEffect(() => {
    if (pageAttributes && pageAttributes > 1) refetchAttributes();
  }, [pageAttributes]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/nutriplan/mealPlanning/ingredients");
    }
  }, [isSuccess]);

  return (
    <Grid container spacing={3}>
      <AppBreadcrumb
        paths={[
          { name: messages["sidebar.nutriplanManagement.title"] },
          { name: messages["sidebar.mealPlanning.title"] },
          {
            name: messages["sidebar.ingredients"],
            path: "/nutriplan/mealPlanning/ingredients",
          },
        ]}
        currentPathName={"ingredients.add"}
      />
      <Grid item xs={12}>
        <Card>
          <CardHeader
            sx={{
              borderBottom: "1px solid #a5d060",

              ".MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "18px",
                color: "#a5d060",
              },
            }}
            title={messages["ingredients.add"] as string}
          />
          <CardContent>
            <LoadingAndErrorWrapper isLoading={addLoading} errorMessage=''>
              <Formik
                validateOnChange={true}
                initialValues={defaultValues.CreateDefaultValues()}
                validationSchema={validationSchema}
                innerRef={refForm}
                onSubmit={async (data, { setSubmitting }) => {
                  let dataToSend = serialize(
                    {
                      ...data,
                      costPer100Unit:
                        data?.price &&
                        data?.amount &&
                        Math.floor((data?.price / data?.amount) * 100).toFixed(
                          2
                        ),
                    },
                    {
                      indices: true,
                    }
                  );
                  addIngredientMethod(dataToSend);
                }}>
                {({ setFieldValue, values, errors, touched }) => {
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
                          <AppBaseAutoComplete
                            label='categories.name'
                            isLoading={isFetchingCategories}
                            options={categoriesList?.data}
                            hasNextPage={categoriesList?.hasNextPage}
                            pageNumber={pageCategories}
                            changePage={changePageCategories}
                            onChangeAutoComplete={(event, value) => {
                              setFieldValue(
                                "categoryId",
                                value ? value?.id : ""
                              );
                              changePageCategories(1);
                            }}
                            searchText={searchValueCategories}
                            onChangeTextField={(value) => {
                              setSearchValueCategories(value.target.value);
                              changePageCategories(1);
                            }}
                            error={errors.categoryId}
                            touched={touched.categoryId}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name='type'
                            labelId='ingredients.type'
                            label={messages["ingredients.type"] as string}
                            error={Boolean(errors?.type)}>
                            <MenuItem value={ingredientType.Dairy}>
                              <IntlMessages id='ingredients.type.Dairy' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Fruit}>
                              <IntlMessages id='ingredients.type.Fruit' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Grain}>
                              <IntlMessages id='ingredients.type.Grain' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Meat}>
                              <IntlMessages id='ingredients.type.Meat' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Spice}>
                              <IntlMessages id='ingredients.type.Spice' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Vegetable}>
                              <IntlMessages id='ingredients.type.Vegetable' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Nut}>
                              <IntlMessages id='ingredients.type.Nut' />
                            </MenuItem>
                            <MenuItem value={ingredientType.Other}>
                              <IntlMessages id='ingredients.type.Other' />
                            </MenuItem>
                          </AppSelectField>
                        </Grid>
                        <Grid item xs={4}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name='dietaryPreference'
                            labelId='ingredients.dietaryPreference'
                            label={
                              messages[
                                "ingredients.dietaryPreference"
                              ] as string
                            }
                            error={Boolean(errors?.dietaryPreference)}>
                            <MenuItem value={dietaryPreference.None}>
                              <IntlMessages id='ingredients.dietaryPreference.None' />
                            </MenuItem>
                            <MenuItem value={dietaryPreference.Keto}>
                              <IntlMessages id='ingredients.dietaryPreference.Keto' />
                            </MenuItem>
                            <MenuItem value={dietaryPreference.Paleo}>
                              <IntlMessages id='ingredients.dietaryPreference.Paleo' />
                            </MenuItem>
                            <MenuItem value={dietaryPreference.Vegan}>
                              <IntlMessages id='ingredients.dietaryPreference.Vegan' />
                            </MenuItem>
                            <MenuItem value={dietaryPreference.Vegetarian}>
                              <IntlMessages id='ingredients.dietaryPreference.Vegetarian' />
                            </MenuItem>
                            <MenuItem value={dietaryPreference.NonVegetarian}>
                              <IntlMessages id='ingredients.dietaryPreference.NonVegetarian' />
                            </MenuItem>
                          </AppSelectField>
                        </Grid>
                        <Grid item xs={4}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name='status'
                            labelId='ingredients.status'
                            label={messages["ingredients.status"] as string}
                            error={Boolean(errors?.status)}>
                            <MenuItem value={ingredientStatus.Available}>
                              <IntlMessages id='ingredients.status.Available' />
                            </MenuItem>
                            <MenuItem value={ingredientStatus.Discontinued}>
                              <IntlMessages id='ingredients.status.Discontinued' />
                            </MenuItem>
                            <MenuItem value={ingredientStatus.OutOfStock}>
                              <IntlMessages id='ingredients.status.OutOfStock' />
                            </MenuItem>
                          </AppSelectField>
                        </Grid>

                        <Grid item xs={4}>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <InputLabel id='select-footer'>
                              {messages["ingredients.basicUnit"] as string}
                            </InputLabel>

                            <Select
                              value={values?.basicUnit}
                              defaultValue={values?.basicUnit}
                              fullWidth
                              size='small'
                              name='basicUnit'
                              labelId='ingredients.basicUnit'
                              label={
                                messages["ingredients.basicUnit"] as string
                              }
                              onChange={(event) => {
                                setFieldValue("Density", 1);
                                setFieldValue("basicUnit", event.target.value);
                                setFieldValue(
                                  "priceUnit",
                                  event.target.value === basicUnit.Liquid
                                    ? "ml"
                                    : "g"
                                );
                                setFieldValue("caloriesUnit", "g");
                              }}>
                              <MenuItem value={basicUnit.Solid}>
                                <IntlMessages id='ingredients.basicUnit.Solid' />
                              </MenuItem>
                              <MenuItem value={basicUnit.Liquid}>
                                <IntlMessages id='ingredients.basicUnit.Liquid' />
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {values?.basicUnit === basicUnit.Liquid && (
                          <Grid item xs={4}>
                            <AppTextField
                              label={
                                <>
                                  <IntlMessages id='ingredients.density' />{" "}
                                  (g/ml)
                                </>
                              }
                              name='density'
                              type='number'
                              variant='outlined'
                              size='small'
                              fullWidth
                            />{" "}
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <AppTags
                            error={errors?.tags}
                            touched={touched?.tags}
                            label='ingredients.tags'
                            onChangeAutoComplete={(event, value) =>
                              setFieldValue("tags", value)
                            }
                            value={values?.tags}
                          />
                        </Grid>
                        <Grid item container xs={6} alignItems={"center"}>
                          <Grid item xs={6}>
                            <AppTextField
                              label={
                                <>
                                  <IntlMessages id='ingredients.price' />
                                </>
                              }
                              name='price'
                              type='number'
                              variant='outlined'
                              size='small'
                              fullWidth
                            />{" "}
                          </Grid>
                          <Grid item xs={2}>
                            <div
                              style={{
                                margin: "0px 1.1rem",
                                fontSize: 16,
                                fontWeight: "500",
                              }}>
                              <IntlMessages id='ingredients.AED' />
                            </div>
                          </Grid>

                          <Grid item xs={4}>
                            <AppTextField
                              label={
                                <>
                                  <IntlMessages id='ingredients.amount' />
                                </>
                              }
                              name='amount'
                              type='number'
                              variant='outlined'
                              size='small'
                              fullWidth
                            />{" "}
                          </Grid>
                        </Grid>
                        <Grid item container xs={6} alignItems={"center"}>
                          <Grid item>
                            <FormControl
                              variant='outlined'
                              fullWidth
                              size='small'>
                              <Select
                                value={values?.priceUnit}
                                defaultValue={values?.priceUnit}
                                fullWidth
                                size='small'
                                name='priceUnit'
                                onChange={(event) => {
                                  setFieldValue(
                                    "priceUnit",
                                    event.target.value
                                  );
                                }}>
                                {values?.basicUnit === basicUnit.Liquid && (
                                  <MenuItem value={"l"}>l</MenuItem>
                                )}

                                {values?.basicUnit === basicUnit.Liquid && (
                                  <MenuItem value={"ml"}>ml</MenuItem>
                                )}

                                {values?.basicUnit === basicUnit.Solid && (
                                  <MenuItem value={"g"}>g</MenuItem>
                                )}

                                {values?.basicUnit === basicUnit.Solid && (
                                  <MenuItem value={"kg"}>kg</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <div
                              style={{
                                margin: "0px 1.1rem",
                                fontSize: 14,
                                fontWeight: "500",
                              }}>
                              {values?.priceUnit != "ml" &&
                                values?.priceUnit != "l" &&
                                values?.price &&
                                values?.amount &&
                                `(${((values?.price / values?.amount) * 100).toFixed(2)}AED / ${values?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}

                              {values?.priceUnit === "ml" &&
                                values?.price &&
                                values?.amount &&
                                `(${((values?.price / values?.amount) * 100).toFixed(2)}AED / ${values?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}

                              {values?.priceUnit === "l" &&
                                values?.price &&
                                values?.amount &&
                                `(${(values?.price / values?.amount / 10).toFixed(2)}AED / ${values?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
                              {(!values?.price || !values?.amount) &&
                                `(0AED / ${values?.basicUnit === basicUnit.Liquid ? "100ml" : "100g"})`}
                            </div>
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <AppBaseAutoComplete
                            label='sidebar.allergens'
                            isLoading={isFetchingAllergens}
                            options={allergensList?.data?.filter(
                              (part) => !values?.allergenIds?.includes(part.id)
                            )}
                            hasNextPage={allergensList?.hasNextPage}
                            pageNumber={pageAllergens}
                            changePage={changePageAllergens}
                            multiple
                            onChangeAutoComplete={(event, value) => {
                              setFieldValue(
                                "allergenIds",
                                value
                                  ? value?.map((item: IAllergens) => item?.id)
                                  : ""
                              );

                              changePageAllergens(1);
                            }}
                            searchText={searchValueAllergens}
                            onChangeTextField={(value) => {
                              setSearchValueAllergens(value.target.value);
                              changePageAllergens(1);
                            }}
                            error={errors.allergenIds}
                            touched={touched.allergenIds}
                          />
                        </Grid>
                        <Grid item container xs={12}>
                          <Grid item>
                            <AppCheckbox
                              keyName='isDairyFree'
                              label='ingredients.isDairyFree'
                              defaultChecked={values?.isDairyFree}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isLowGI'
                              label='ingredients.isLowGI'
                              defaultChecked={values?.isLowGI}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isSeasonal'
                              label='ingredients.isSeasonal'
                              defaultChecked={values?.isSeasonal}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isOrganic'
                              label='ingredients.isOrganic'
                              defaultChecked={values?.isOrganic}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isGlutenFree'
                              label='ingredients.isGlutenFree'
                              defaultChecked={values?.isGlutenFree}
                              onChange={setFieldValue}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={3}>
                          <Grid item>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: Fonts.SEMI_BOLD,
                              }}>
                              Nutration in 100 unit of{" "}
                            </Typography>
                          </Grid>

                          <Grid item>
                            <FormControl
                              variant='outlined'
                              fullWidth
                              size='small'>
                              <Select
                                value={values?.caloriesUnit}
                                defaultValue={values?.caloriesUnit}
                                fullWidth
                                size='small'
                                name='caloriesUnit'
                                onChange={(event) => {
                                  setFieldValue(
                                    "caloriesUnit",
                                    event.target.value
                                  );
                                }}>
                                {(values?.basicUnit === basicUnit.Solid ||
                                  values?.basicUnit === basicUnit.Liquid) && (
                                  <MenuItem value={"g"}>g</MenuItem>
                                )}

                                {values?.basicUnit === basicUnit.Liquid && (
                                  <MenuItem value={"ml"}>ml</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid item container xs={12}>
                          <Grid item xs={4}>
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: Fonts.SEMI_BOLD,
                              }}>
                              <IntlMessages id={"common.name"} />
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: Fonts.SEMI_BOLD,
                              }}>
                              <IntlMessages id={"common.value"} />
                            </Typography>
                          </Grid>
                        </Grid>

                        <IngredientQuantityField
                          name='caloriesPer100Unit'
                          title='ingredients.caloriesPer100Unit'
                          unit='kcal'
                        />

                        <IngredientQuantityField
                          name='fatPer100Unit'
                          title='ingredients.fatPer100Unit'
                          unit='g'
                        />

                        <IngredientQuantityField
                          name='carbsPer100Unit'
                          title='ingredients.carbsPer100Unit'
                          unit='g'
                        />

                        <IngredientQuantityField
                          name='proteinPer100Unit'
                          title='ingredients.proteinPer100Unit'
                          unit='g'
                        />

                        <IngredientQuantityField
                          name='fiberPer100Unit'
                          title='ingredients.fiberPer100Unit'
                          unit='g'
                        />

                        <IngredientQuantityField
                          name='sugarPer100Unit'
                          title='ingredients.sugarPer100Unit'
                          unit='g'
                        />

                        <IngredientQuantityField
                          name='waterPer100g'
                          title='ingredients.waterPer100g'
                          unit='ml'
                        />

                        <IngredientQuantityField
                          name='cholesterolPer100Unit'
                          title='ingredients.cholesterolPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='totalSaturatedFattyAcids'
                          title='ingredients.totalSaturatedFattyAcids'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid4_0'
                          title='ingredients.saturatedFattyAcid4_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid6_0'
                          title='ingredients.saturatedFattyAcid6_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid8_0'
                          title='ingredients.saturatedFattyAcid8_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid10_0'
                          title='ingredients.saturatedFattyAcid10_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid12_0'
                          title='ingredients.saturatedFattyAcid12_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid14_0'
                          title='ingredients.saturatedFattyAcid14_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid16_0'
                          title='ingredients.saturatedFattyAcid16_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='saturatedFattyAcid18_0'
                          title='ingredients.saturatedFattyAcid18_0'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='monounsaturatedFattyAcid16_1'
                          title='ingredients.monounsaturatedFattyAcid16_1'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='totalMonounsaturatedFattyAcids'
                          title='ingredients.totalMonounsaturatedFattyAcids'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='monounsaturatedFattyAcid18_1'
                          title='ingredients.monounsaturatedFattyAcid18_1'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='monounsaturatedFattyAcid20_1'
                          title='ingredients.monounsaturatedFattyAcid20_1'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='totalPolyunsaturatedFattyAcids'
                          title='ingredients.totalPolyunsaturatedFattyAcids'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='monounsaturatedFattyAcid22_1'
                          title='ingredients.monounsaturatedFattyAcid22_1'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid18_2'
                          title='ingredients.polyunsaturatedFattyAcid18_2'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid18_3'
                          title='ingredients.polyunsaturatedFattyAcid18_3'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid20_4'
                          title='ingredients.polyunsaturatedFattyAcid20_4'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid18_4'
                          title='ingredients.polyunsaturatedFattyAcid18_4'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid20_5'
                          title='ingredients.polyunsaturatedFattyAcid20_5'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid22_5'
                          title='ingredients.polyunsaturatedFattyAcid22_5'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='polyunsaturatedFattyAcid22_6'
                          title='ingredients.polyunsaturatedFattyAcid22_6'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='calciumPer100Unit'
                          title='ingredients.calciumPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='ironPer100Unit'
                          title='ingredients.ironPer100Unit'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='magnesiumPer100Unit'
                          title='ingredients.magnesiumPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='phosphorusPer100Unit'
                          title='ingredients.phosphorusPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='potassiumPer100Unit'
                          title='ingredients.potassiumPer100Unit'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='sodiumPer100Unit'
                          title='ingredients.sodiumPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='zincPer100Unit'
                          title='ingredients.zincPer100Unit'
                          unit='mg'
                        />

                        <IngredientQuantityField
                          name='copperPer100Unit'
                          title='ingredients.copperPer100Unit'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='seleniumPer100Unit'
                          title='ingredients.seleniumPer100Unit'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='vitaminARAE'
                          title='ingredients.vitaminARAE'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='retinol'
                          title='ingredients.retinol'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='caroteneAlpha'
                          title='ingredients.caroteneAlpha'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='caroteneBeta'
                          title='ingredients.caroteneBeta'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='cryptoxanthinBeta'
                          title='ingredients.cryptoxanthinBeta'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='lycopene'
                          title='ingredients.lycopene'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='luteinZeaxanthin'
                          title='ingredients.luteinZeaxanthin'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='vitaminE'
                          title='ingredients.vitaminE'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='vitaminD'
                          title='ingredients.vitaminD'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='vitaminK'
                          title='ingredients.vitaminK'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='vitaminC'
                          title='ingredients.vitaminC'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='thiamin'
                          title='ingredients.thiamin'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='riboflavin'
                          title='ingredients.riboflavin'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='niacin'
                          title='ingredients.niacin'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='vitaminB6'
                          title='ingredients.vitaminB6'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='folateTotal'
                          title='ingredients.folateTotal'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='folateDFE'
                          title='ingredients.folateDFE'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='folicAcid'
                          title='ingredients.folicAcid'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='folateFood'
                          title='ingredients.folateFood'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='vitaminB12'
                          title='ingredients.vitaminB12'
                          unit='µg'
                        />
                        <IngredientQuantityField
                          name='choline'
                          title='ingredients.choline'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='alcohol'
                          title='ingredients.alcohol'
                          unit='g'
                        />
                        <IngredientQuantityField
                          name='caffeine'
                          title='ingredients.caffeine'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='theobromine'
                          title='ingredients.theobromine'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='addedVitaminE'
                          title='ingredients.addedVitaminE'
                          unit='mg'
                        />
                        <IngredientQuantityField
                          name='addedVitaminB12'
                          title='ingredients.addedVitaminB12'
                          unit='µg'
                        />

                        <Grid item xs={12}>
                          <Divider
                            sx={{
                              color: "#a5d060",
                              fontWeight: Fonts.SEMI_BOLD,
                            }}
                            variant='fullWidth'>
                            {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
                            <Chip
                              label={
                                messages["sidebar.measurementUnits"] as string
                              }
                              size='medium'
                              color='primary'
                              sx={{ fontSize: 17 }}
                            />
                          </Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <FieldArray
                            name='ingredientMeasurementUnits'
                            render={(arrayHelpers) => (
                              <Grid container xs={12} item spacing={4}>
                                <Grid
                                  item
                                  xs={12}
                                  display={"flex"}
                                  justifyContent={"center"}>
                                  {values?.ingredientMeasurementUnits
                                    ?.length! === 0 && (
                                    <AppIconButton
                                      label='ingredients.attributes.add'
                                      handleClick={() => {
                                        arrayHelpers.push({
                                          code: "",
                                          equivalentInUnit: null,
                                          measurementUnit: null,
                                        });
                                      }}
                                      childComp={
                                        <AddCircleIcon
                                          fontSize='large'
                                          sx={{ color: "#a5d060" }}
                                        />
                                      }
                                    />
                                  )}
                                </Grid>
                                {values?.ingredientMeasurementUnits?.map(
                                  (item, index) => {
                                    return (
                                      <Grid item container xs={12} spacing={4}>
                                        <Grid item xs={4}>
                                          <AppBaseAutoComplete
                                            // key={values?.sets}
                                            label='measurementUnits.name'
                                            getOptionLabel={(option) => {
                                              return option?.code;
                                            }}
                                            filterKey='code'
                                            isLoading={
                                              isFetchingMeasurementUnits
                                            }
                                            options={measurementUnitsList?.data}
                                            hasNextPage={
                                              measurementUnitsList?.hasNextPage
                                            }
                                            pageNumber={pageMeasurementUnits}
                                            changePage={
                                              changePageMeasurementUnits
                                            }
                                            defaultValue={
                                              values
                                                ?.ingredientMeasurementUnits![
                                                index
                                              ]?.measurementUnit || null
                                            }
                                            onChangeAutoComplete={(
                                              event,
                                              value
                                            ) => {
                                              setFieldValue(
                                                `ingredientMeasurementUnits[${index}].measurementUnit`,
                                                value ? value : null
                                              );
                                              setFieldValue(
                                                `ingredientMeasurementUnits[${index}].code`,
                                                value ? value?.code : ""
                                              );

                                              changePageMeasurementUnits(1);
                                            }}
                                            searchText={
                                              searchValueMeasurementUnits
                                            }
                                            onChangeTextField={(value) => {
                                              setSearchValueMeasurementUnits(
                                                value.target.value
                                              );
                                              changePageMeasurementUnits(1);
                                            }}
                                            error={
                                              errors?.ingredientMeasurementUnits &&
                                              (
                                                (
                                                  errors?.ingredientMeasurementUnits as any
                                                )[index] as any
                                              )?.code
                                            }
                                            touched={
                                              touched?.ingredientMeasurementUnits &&
                                              (
                                                (
                                                  touched?.ingredientMeasurementUnits as any
                                                )[index] as any
                                              )?.code
                                            }
                                          />
                                        </Grid>

                                        <Grid item xs={3}>
                                          <AppTextField
                                            label={
                                              <>
                                                <IntlMessages id='ingredients.ingredientMeasurementUnits.equivalentInUnit' />{" "}
                                                {values?.basicUnit ===
                                                basicUnit.Liquid
                                                  ? "(ml)"
                                                  : "(g)"}
                                              </>
                                            }
                                            name={`ingredientMeasurementUnits[${index}].equivalentInUnit`}
                                            variant='outlined'
                                            size='small'
                                            fullWidth
                                            type='number'
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={1}
                                          container
                                          columnGap={2}
                                          alignItems={"center"}>
                                          <AppIconButton
                                            label='ingredients.ingredientMeasurementUnits.delete'
                                            handleClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                            // disabled={
                                            //   values?.ingredientMeasurementUnits
                                            //     ?.length === 1
                                            // }
                                            // Disable if there's only one item
                                            childComp={
                                              <DeleteForeverIcon
                                                fontSize='medium'
                                                sx={{ color: "#ff5252" }}
                                              />
                                            }
                                          />
                                          {index ===
                                            values?.ingredientMeasurementUnits
                                              ?.length! -
                                              1 && (
                                            <AppIconButton
                                              label='ingredients.ingredientMeasurementUnits.add'
                                              handleClick={() => {
                                                arrayHelpers.push({
                                                  code: "",
                                                  equivalentInUnit: null,
                                                  measurementUnit: null,
                                                });
                                              }}
                                              childComp={
                                                <AddCircleIcon
                                                  fontSize='medium'
                                                  sx={{ color: "#a5d060" }}
                                                />
                                              }
                                            />
                                          )}
                                        </Grid>
                                      </Grid>
                                    );
                                  }
                                )}
                              </Grid>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Divider
                            sx={{
                              color: "#a5d060",
                              fontWeight: Fonts.SEMI_BOLD,
                            }}
                            variant='fullWidth'>
                            {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
                            <Chip
                              label={
                                messages[
                                  "sidebar.nutrientsAttributes"
                                ] as string
                              }
                              size='medium'
                              color='primary'
                              sx={{ fontSize: 17 }}
                            />
                          </Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <FieldArray
                            name='attributes'
                            render={(arrayHelpers) => (
                              <Grid container xs={12} item spacing={4}>
                                <Grid
                                  item
                                  xs={12}
                                  display={"flex"}
                                  justifyContent={"center"}>
                                  {values?.attributes?.length! === 0 && (
                                    <AppIconButton
                                      label='ingredients.ingredientMeasurementUnits.add'
                                      handleClick={() => {
                                        arrayHelpers.push({
                                          nutrientsAttributeId: "",
                                          value: null,
                                          nutrientsAttribute: null,
                                        });
                                      }}
                                      childComp={
                                        <AddCircleIcon
                                          fontSize='large'
                                          sx={{ color: "#a5d060" }}
                                        />
                                      }
                                    />
                                  )}
                                </Grid>
                                {values?.attributes?.map((item, index) => {
                                  return (
                                    <Grid item container xs={12} spacing={4}>
                                      <Grid item xs={4}>
                                        <AppBaseAutoComplete
                                          // key={values?.sets}
                                          label='attributes.name'
                                          isLoading={isFetchingAttributes}
                                          options={attributesList?.data}
                                          hasNextPage={
                                            attributesList?.hasNextPage
                                          }
                                          pageNumber={pageAttributes}
                                          changePage={changePageAttributes}
                                          defaultValue={
                                            values?.attributes![index]
                                              ?.nutrientsAttributeId || null
                                          }
                                          onChangeAutoComplete={(
                                            event,
                                            value
                                          ) => {
                                            setFieldValue(
                                              `attributes[${index}].nutrientsAttribute`,
                                              value ? value : null
                                            );
                                            setFieldValue(
                                              `attributes[${index}].nutrientsAttributeId`,
                                              value ? value?.id : ""
                                            );

                                            changePageAttributes(1);
                                          }}
                                          searchText={searchValueAttributes}
                                          onChangeTextField={(value) => {
                                            setSearchValueAttributes(
                                              value.target.value
                                            );
                                            changePageAttributes(1);
                                          }}
                                          error={
                                            errors?.attributes &&
                                            (
                                              (errors?.attributes as any)[
                                                index
                                              ] as any
                                            )?.nutrientsAttributeId
                                          }
                                          touched={
                                            touched?.attributes &&
                                            (
                                              (touched?.attributes as any)[
                                                index
                                              ] as any
                                            )?.nutrientsAttributeId
                                          }
                                        />
                                      </Grid>

                                      <Grid item xs={3}>
                                        <AppTextField
                                          label={
                                            <IntlMessages id='ingredients.attributes.value' />
                                          }
                                          name={`attributes[${index}].value`}
                                          variant='outlined'
                                          size='small'
                                          fullWidth
                                          type='number'
                                        />
                                      </Grid>

                                      <Grid
                                        item
                                        xs={1}
                                        container
                                        columnGap={2}
                                        alignItems={"center"}>
                                        <AppIconButton
                                          label='ingredients.attributes.delete'
                                          handleClick={() => {
                                            arrayHelpers.remove(index);
                                          }}
                                          // disabled={
                                          //   values?.attributes?.length === 1
                                          // }
                                          // Disable if there's only one item
                                          childComp={
                                            <DeleteForeverIcon
                                              fontSize='medium'
                                              sx={{ color: "#ff5252" }}
                                            />
                                          }
                                        />
                                        {index ===
                                          values?.attributes?.length! - 1 && (
                                          <AppIconButton
                                            label='ingredients.attributes.add'
                                            handleClick={() => {
                                              arrayHelpers.push({
                                                nutrientsAttributeId: "",
                                                value: null,
                                                nutrientsAttribute: null,
                                              });
                                            }}
                                            childComp={
                                              <AddCircleIcon
                                                fontSize='medium'
                                                sx={{ color: "#a5d060" }}
                                              />
                                            }
                                          />
                                        )}
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='storageInstructionsAr'
                            label='ingredients.storageInstructionsAr'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='storageInstructionsEn'
                            label='ingredients.storageInstructionsEn'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='descriptionAr'
                            label='common.descriptionAr'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='descriptionEn'
                            label='common.descriptionEn'
                          />
                        </Grid>
                      </Grid>
                    </Form>
                  );
                }}
              </Formik>
            </LoadingAndErrorWrapper>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "end",
              margin: "0px 0.5rem 1rem",
            }}>
            <AppButton
              label='common.cancel'
              color='warning'
              onClick={() => {
                navigate("/nutriplan/mealPlanning/ingredients");
              }}
            />
            <AppButton
              label={"common.add"}
              loading={addLoading}
              onClick={() => {
                submit();
              }}
            />
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddIngredient;

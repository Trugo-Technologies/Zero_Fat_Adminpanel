/** @format */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  MenuItem
} from "@mui/material";
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useNavigate } from "react-router-dom";
import AppSelectField from "src/@crema/components/AppFormComponents/AppSelectField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppCheckbox from "src/Components/baseComponents/inputs/AppCheckbox";
import AppTags from "src/Components/baseComponents/inputs/AppTags";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { createValidationSchemas } from "src/Components/nutriplan-module/mealPlanning/recipes/validations";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllCategoriesQuery } from "src/pages/nutriplan-module/Categories/services/api";
import { useGetAllIngredientsQuery } from "src/pages/nutriplan-module/mealPlanning/ingredients/services/api";
import { useAddRecipesMutation } from "src/pages/nutriplan-module/mealPlanning/recipes/services/api";
import { useGetAllMealTypesQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import {
  recipeDietaryCategories,
  recipesCuisine,
  recipesDifficulty
} from "src/types/enums";
import { ICategoriesListDto } from "src/types/modules/nutriplan/categories";
import { IIngredientsListDto } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import { ICreateRecipesDto } from "src/types/modules/nutriplan/mealPlanning/recipes";
import {
  IMealTypes,
  IMealTypesListDto
} from "src/types/modules/nutriplan/mealTypes";

import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";
import FoodEnergyRow from "./FoodEnergyRow";
import ItemFoodEnergy from "./ItemFoodEnergy";

const AddRecipes = () => {
  const navigate = useNavigate();
  const { messages } = useIntl();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const refForm = useRef<FormikProps<ICreateRecipesDto>>(null);
  const { validationSchema } = createValidationSchemas(messages);
  const [addRecipesMethod, { isLoading: addLoading, isSuccess }] =
    useAddRecipesMutation();

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
      categoryType: "Recipe",
    }
  );

  const {
    changePage: changePageMealTypes,
    data: mealTypesList,
    isFetching: isFetchingMealTypes,
    page: pageMealTypes,
    setSearchValue: setSearchValueMealTypes,
    searchValue: searchValueMealTypes,
    refetch: refetchMealTypes,
  } = usePaginateData<IMealTypesListDto>(useGetAllMealTypesQuery);

  const {
    changePage: changePageIngredients,
    data: ingredientsList,
    isFetching: isFetchingIngredients,
    page: pageIngredients,
    setSearchValue: setSearchValueIngredients,
    searchValue: searchValueIngredients,
    refetch: refetchIngredients,
  } = usePaginateData<IIngredientsListDto>(useGetAllIngredientsQuery);

  const submit = () => {
    if (refForm.current) {
      refForm.current.submitForm();
    }
  };

  useEffect(() => {
    if (pageCategories && pageCategories > 1) refetchCategories();
  }, [pageCategories]);

  useEffect(() => {
    if (pageMealTypes && pageMealTypes > 1) refetchMealTypes();
  }, [pageMealTypes]);

  useEffect(() => {
    if (pageIngredients && pageIngredients > 1) refetchIngredients();
  }, [pageIngredients]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/nutriplan/mealPlanning/recipes");
    }
  }, [isSuccess]);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.mealPlanning.title"] },
            {
              name: messages["sidebar.recipes"],
              path: "/nutriplan/mealPlanning/recipes",
            },
          ]}
          currentPathName={"recipes.add"}
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
              title={messages["recipes.add"] as string}
            />
            <CardContent>
              <LoadingAndErrorWrapper isLoading={addLoading} errorMessage=''>
                <Formik
                  validateOnChange={true}
                  initialValues={{
                    nameAr: "",
                    nameEn: "",
                    categoryId: "",
                    category: null,
                    preparationTime: null,
                    servings: null,
                    cookingTime: null,
                    cuisine: recipesCuisine.American || "",
                    difficulty: recipesDifficulty.Easy || "",
                    dietaryCategories: [`${recipeDietaryCategories.Omnivore}`],
                    tags: [],
                    fullRecipeTextAr: "",
                    fullRecipeTextEn: "",
                    recipeMealTypeIds: [],
                    recipeMealTypes: null,
                    recipeIngredients: [
                      {
                        ingredientId: "",
                        ingredient: null,
                        measurementUnitCode: "",
                        amount: null,
                        hideOnCustomerPorter: false,
                        isOptional: false,
                        measurementUnit: null,
                      },
                    ],
                    // image: "",
                    isCold: false,
                    isDairyFree: false,
                    isGlutenFree: false,
                    isLowGI: false,
                    isVegan: false,
                    isVegetarian: false,
                    isWarm: false,
                    suitableForFreezing: false,
                    preparationMethodAr: "",
                    preparationMethodEn: "",
                  }}
                  validationSchema={validationSchema}
                  innerRef={refForm}
                  onSubmit={async (data) => {
                    let dataToSend = {
                      ...data,
                      cookingTime: data?.cookingTime ? data?.cookingTime : 0,
                      preparationTime: data?.preparationTime
                        ? data?.preparationTime
                        : 0,
                    };
                    addRecipesMethod(dataToSend);
                  }}>
                  {({ errors, values, setFieldValue, touched }) => (
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
                            name='difficulty'
                            labelId='recipes.difficulty'
                            label={messages["recipes.difficulty"] as string}
                            error={Boolean(errors?.difficulty)}>
                            <MenuItem value={recipesDifficulty.Easy}>
                              <IntlMessages id='recipes.difficulty.Easy' />
                            </MenuItem>
                            <MenuItem value={recipesDifficulty.Medium}>
                              <IntlMessages id='recipes.difficulty.Medium' />
                            </MenuItem>

                            <MenuItem value={recipesDifficulty.Hard}>
                              <IntlMessages id='recipes.difficulty.Hard' />
                            </MenuItem>
                          </AppSelectField>
                        </Grid>

                        <Grid item xs={4}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name='cuisine'
                            labelId='recipes.cuisine'
                            label={messages["recipes.cuisine"] as string}
                            error={Boolean(errors?.cuisine)}>
                            {Object.entries(recipesCuisine).map(
                              ([key, value]) => (
                                <MenuItem key={key} value={value}>
                                  <IntlMessages
                                    id={`recipes.cuisine.${value}`}
                                  />
                                </MenuItem>
                              )
                            )}
                          </AppSelectField>
                        </Grid>

                        <Grid item xs={8}>
                          <AppSelectField
                            fullWidth
                            size='small'
                            name='dietaryCategories'
                            labelId='recipes.dietaryCategories'
                            label={
                              messages["recipes.dietaryCategories"] as string
                            }
                            error={Boolean(errors?.dietaryCategories)}
                            multiple>
                            {/* <MenuItem value={recipeDietaryCategories.None}>
                            <IntlMessages id="recipes.dietaryCategories.None" />
                          </MenuItem> */}
                            <MenuItem value={recipeDietaryCategories.Omnivore}>
                              <IntlMessages id='recipes.dietaryCategories.Omnivore' />
                            </MenuItem>

                            <MenuItem
                              value={recipeDietaryCategories.Pescatarian}>
                              <IntlMessages id='recipes.dietaryCategories.Pescatarian' />
                            </MenuItem>

                            <MenuItem value={recipeDietaryCategories.Vegan}>
                              <IntlMessages id='recipes.dietaryCategories.Vegan' />
                            </MenuItem>

                            <MenuItem
                              value={recipeDietaryCategories.Vegetarian}>
                              <IntlMessages id='recipes.dietaryCategories.Vegetarian' />
                            </MenuItem>
                          </AppSelectField>
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

                        <Grid item xs={8}>
                          <AppBaseAutoComplete
                            label='sidebar.mealTypes'
                            isLoading={isFetchingMealTypes}
                            options={mealTypesList?.data?.filter(
                              (item) =>
                                !values?.recipeMealTypeIds?.includes(item.id)
                            )}
                            hasNextPage={mealTypesList?.hasNextPage}
                            pageNumber={pageMealTypes}
                            changePage={changePageMealTypes}
                            multiple
                            onChangeAutoComplete={(event, value) => {
                              setFieldValue(
                                "recipeMealTypeIds",
                                value
                                  ? value?.map((item: IMealTypes) => item?.id)
                                  : ""
                              );

                              changePageMealTypes(1);
                            }}
                            searchText={searchValueMealTypes}
                            onChangeTextField={(value) => {
                              setSearchValueMealTypes(value.target.value);
                              changePageMealTypes(1);
                            }}
                            error={errors.recipeMealTypeIds}
                            touched={touched.recipeMealTypeIds}
                          />
                        </Grid>

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
                              keyName='isVegan'
                              label='recipes.isVegan'
                              defaultChecked={values?.isVegan}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isVegetarian'
                              label='recipes.isVegetarian'
                              defaultChecked={values?.isVegetarian}
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

                          <Grid item>
                            <AppCheckbox
                              keyName='isCold'
                              label='recipes.isCold'
                              defaultChecked={values?.isCold}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          <Grid item>
                            <AppCheckbox
                              keyName='isWarm'
                              label='recipes.isWarm'
                              defaultChecked={values?.isWarm}
                              onChange={setFieldValue}
                            />
                          </Grid>
                          {/* <Grid item>
                          <AppCheckbox
                            keyName="suitableForFreezing"
                            label="recipes.suitableForFreezing"
                            defaultChecked={values?.suitableForFreezing}
                            onChange={setFieldValue}
                          />
                        </Grid> */}
                        </Grid>

                        <Grid item xs={4}>
                          <AppTextField
                            label={
                              <IntlMessages id='recipes.preparationTime' />
                            }
                            name='preparationTime'
                            variant='outlined'
                            size='small'
                            fullWidth
                            type='number'
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <AppTextField
                            label={<IntlMessages id='recipes.cookingTime' />}
                            name='cookingTime'
                            variant='outlined'
                            size='small'
                            fullWidth
                            type='number'
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <AppTextField
                            label={<IntlMessages id='recipes.servings' />}
                            name='servings'
                            variant='outlined'
                            size='small'
                            fullWidth
                            type='number'
                          />
                        </Grid>

                        <FoodEnergyRow
                          recipeIngredients={values?.recipeIngredients || []}
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
                              label={messages["sidebar.ingredients"] as string}
                              size='medium'
                              color='primary'
                              sx={{ fontSize: 17 }}
                            />
                          </Divider>
                        </Grid>

                        <Grid item xs={12}>
                          <FieldArray
                            name='recipeIngredients'
                            render={(arrayHelpers) => (
                              <Grid container xs={12} item spacing={4}>
                                {values?.recipeIngredients?.map(
                                  (item, index) => {
                                    return (
                                      <Grid item container xs={12} spacing={4}>
                                        <Grid item xs={3.5}>
                                          <AppBaseAutoComplete
                                            // key={values?.sets}
                                            label='ingredients.name'
                                            isLoading={isFetchingIngredients}
                                            options={ingredientsList?.data}
                                            hasNextPage={
                                              ingredientsList?.hasNextPage
                                            }
                                            pageNumber={pageIngredients}
                                            changePage={changePageIngredients}
                                            defaultValue={
                                              values?.recipeIngredients![index]
                                                ?.ingredientId || null
                                            }
                                            onChangeAutoComplete={(
                                              _,
                                              value
                                            ) => {
                                              setFieldValue(
                                                `recipeIngredients[${index}].ingredient`,
                                                value ? value : null
                                              );
                                              setFieldValue(
                                                `recipeIngredients[${index}].ingredientId`,
                                                value ? value?.id : ""
                                              );

                                              changePageIngredients(1);
                                            }}
                                            searchText={searchValueIngredients}
                                            onChangeTextField={(value) => {
                                              setSearchValueIngredients(
                                                value.target.value
                                              );
                                              changePageIngredients(1);
                                            }}
                                            error={
                                              errors?.recipeIngredients &&
                                              (
                                                (
                                                  errors?.recipeIngredients as any
                                                )[index] as any
                                              )?.ingredientId
                                            }
                                            touched={
                                              touched?.recipeIngredients &&
                                              (
                                                (
                                                  touched?.recipeIngredients as any
                                                )[index] as any
                                              )?.ingredientId
                                            }
                                          />
                                        </Grid>

                                        <Grid item xs={3}>
                                          <AppSelectField
                                            fullWidth
                                            size='small'
                                            name={`recipeIngredients[${index}].measurementUnitCode`}
                                            labelId='measurementUnits.name'
                                            label={
                                              messages[
                                                "measurementUnits.name"
                                              ] as string
                                            }
                                            disabled={
                                              !values?.recipeIngredients[index]
                                                .ingredientId
                                            }
                                            // error={
                                            //   errors?.recipeIngredients &&
                                            //   (
                                            //     (errors?.recipeIngredients as any)[
                                            //       index
                                            //     ] as any
                                            //   )?.measurementUnitCode
                                            // }

                                            // touched={
                                            //   touched?.recipeIngredients &&
                                            //   (
                                            //     (touched?.recipeIngredients as any)[
                                            //       index
                                            //     ] as any
                                            //   )?.measurementUnitCode
                                            // }
                                          >
                                            {values?.recipeIngredients[
                                              index
                                            ]?.ingredient?.ingredientMeasurementUnits?.map(
                                              (item) => {
                                                return (
                                                  <MenuItem value={item?.code}>
                                                    {item?.code}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </AppSelectField>
                                        </Grid>

                                        <Grid item xs={2}>
                                          <AppTextField
                                            label={
                                              <IntlMessages id='recipeIngredients.amount' />
                                            }
                                            name={`recipeIngredients[${index}].amount`}
                                            variant='outlined'
                                            size='small'
                                            fullWidth
                                            type='number'
                                          />
                                        </Grid>

                                        <Grid item xs={1}>
                                          <AppCheckbox
                                            keyName={`recipeIngredients[${index}].hideOnCustomerPorter`}
                                            label='recipes.hideOnCustomerPorter'
                                            defaultChecked={
                                              values?.recipeIngredients[index]
                                                .hideOnCustomerPorter
                                            }
                                            onChange={setFieldValue}
                                          />
                                        </Grid>

                                        <Grid item xs={1}>
                                          <AppCheckbox
                                            keyName={`recipeIngredients[${index}].isOptional`}
                                            label='recipes.isOptional'
                                            defaultChecked={
                                              values?.recipeIngredients[index]
                                                .isOptional
                                            }
                                            onChange={setFieldValue}
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={1.5}
                                          container
                                          columnGap={2}
                                          alignItems={"center"}>
                                          <AppIconButton
                                            label='ingredients.deleteTitle'
                                            handleClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                            disabled={
                                              values?.recipeIngredients
                                                ?.length === 1
                                            }
                                            // Disable if there's only one item
                                            childComp={
                                              <DeleteForeverIcon
                                                fontSize='medium'
                                                sx={{ color: "#ff5252" }}
                                              />
                                            }
                                          />
                                          {index ===
                                            values?.recipeIngredients?.length! -
                                              1 && (
                                            <AppIconButton
                                              label='ingredients.add'
                                              handleClick={() => {
                                                arrayHelpers.push({
                                                  ingredientId: "",
                                                  ingredient: null,
                                                  measurementUnitCode: "",
                                                  measurementUnit: null,
                                                  amount: null,
                                                  hideOnCustomerPorter: false,
                                                  isOptional: false,
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
                                          {item?.ingredient && (
                                            <AppIconButton
                                              label='table.actions.details'
                                              handleClick={() => {
                                                setShowDetailsModal(true);
                                                setSelectedIngredientId(
                                                  item?.ingredient?.id!
                                                );
                                              }}
                                              // Disable if there's only one item
                                              childComp={
                                                <RemoveRedEyeIcon
                                                  fontSize='small'
                                                  sx={{ color: "#9b9b9b" }}
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
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='preparationMethodAr'
                            label='recipes.preparationMethodAr'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='preparationMethodEn'
                            label='recipes.preparationMethodEn'
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='fullRecipeTextAr'
                            label='recipes.fullRecipeTextAr'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AppFreeEditor
                            name='fullRecipeTextEn'
                            label='recipes.fullRecipeTextEn'
                          />
                        </Grid>
                      </Grid>
                    </Form>
                  )}
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
                  navigate("/nutriplan/mealPlanning/recipes");
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

      {showDetailsModal && selectedIngredientId && (
        <ItemFoodEnergy
          id={selectedIngredientId}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
    </>
  );
};

export default AddRecipes;

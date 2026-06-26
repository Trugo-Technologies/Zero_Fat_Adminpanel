/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllCategoriesQuery } from "src/pages/nutriplan-module/Categories/services/api";
import { endPoints } from "src/shared/end-points";
import { categoryType } from "src/types/enums";
import {
  basicUnit,
  dietaryPreference,
  ingredientStatus,
  ingredientType,
} from "src/types/enums";
import { ICategories, ICategoriesListDto } from "src/types/modules/nutriplan/categories";
import { IIngredientsListDto } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import {
  useDeleteAllIngredientsMutation,
  useGetAllIngredientsQuery,
} from "./services/api";
import useIngredients from "./useIngredients";

const ALL_TYPES = "All Types";
const ALL_DIETARY = "All Dietary Preferences";
const ALL_BASIC_UNITS = "All Basic Units";
const ALL_STATUS = "All Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const INGREDIENT_TYPE_OPTIONS = [
  { value: ingredientType.Dairy, labelKey: "ingredients.type.Dairy" },
  { value: ingredientType.Fruit, labelKey: "ingredients.type.Fruit" },
  { value: ingredientType.Grain, labelKey: "ingredients.type.Grain" },
  { value: ingredientType.Meat, labelKey: "ingredients.type.Meat" },
  { value: ingredientType.Spice, labelKey: "ingredients.type.Spice" },
  { value: ingredientType.Vegetable, labelKey: "ingredients.type.Vegetable" },
  { value: ingredientType.Nut, labelKey: "ingredients.type.Nut" },
  { value: ingredientType.Other, labelKey: "ingredients.type.Other" },
] as const;

const DIETARY_PREFERENCE_OPTIONS = [
  { value: dietaryPreference.None, labelKey: "ingredients.dietaryPreference.None" },
  { value: dietaryPreference.Keto, labelKey: "ingredients.dietaryPreference.Keto" },
  { value: dietaryPreference.Paleo, labelKey: "ingredients.dietaryPreference.Paleo" },
  { value: dietaryPreference.Vegan, labelKey: "ingredients.dietaryPreference.Vegan" },
  {
    value: dietaryPreference.Vegetarian,
    labelKey: "ingredients.dietaryPreference.Vegetarian",
  },
  {
    value: dietaryPreference.NonVegetarian,
    labelKey: "ingredients.dietaryPreference.NonVegetarian",
  },
] as const;

const BASIC_UNIT_OPTIONS = [
  { value: basicUnit.Solid, labelKey: "ingredients.basicUnit.Solid" },
  { value: basicUnit.Liquid, labelKey: "ingredients.basicUnit.Liquid" },
] as const;

const STATUS_OPTIONS = [
  { value: ingredientStatus.Available, labelKey: "ingredients.status.Available" },
  {
    value: ingredientStatus.Discontinued,
    labelKey: "ingredients.status.Discontinued",
  },
  { value: ingredientStatus.OutOfStock, labelKey: "ingredients.status.OutOfStock" },
] as const;

type AppliedFilters = {
  type: string;
  dietaryPreference: string;
  basicUnit: string;
  status: string;
};

const IngredientsPage = () => {
  const navigate = useNavigate();
  const { messages } = useIntl();
  const { selectionModel, setSelectionModel, columns, Modals } =
    useIngredients();
  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    refetch,
    setParameter,
  } = usePaginateData<IIngredientsListDto>(useGetAllIngredientsQuery);

  const {
    changePage: changeCategoryPage,
    data: categoriesData,
    isFetching: isFetchingCategories,
    page: categoryPage,
    setSearchValue: setCategorySearchValue,
    refetch: refetchCategories,
  } = usePaginateData<ICategoriesListDto>(
    useGetAllCategoriesQuery,
    {},
    { categoryType: categoryType.Ingredient }
  );

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllIngredientsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategories | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    type: ALL_TYPES,
    dietaryPreference: ALL_DIETARY,
    basicUnit: ALL_BASIC_UNITS,
    status: ALL_STATUS,
  });

  useEffect(() => {
    if (categoryPage && categoryPage > 1) refetchCategories();
  }, [categoryPage, refetchCategories]);

  const syncFiltersToQuery = useCallback(
    (filters: AppliedFilters, categoryId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        categoryId: categoryId || undefined,
        type: filters.type === ALL_TYPES ? undefined : filters.type,
        dietaryPreference:
          filters.dietaryPreference === ALL_DIETARY
            ? undefined
            : filters.dietaryPreference,
        basicUnit:
          filters.basicUnit === ALL_BASIC_UNITS ? undefined : filters.basicUnit,
        status: filters.status === ALL_STATUS ? undefined : filters.status,
      }));
    },
    [setParameter]
  );

  const handleCategoryChange = (_event: unknown, value: ICategories | null) => {
    setSelectedCategory(value);
    syncFiltersToQuery(appliedFilters, value?.id ?? null);
  };

  const handleTypeChange = (value: string) => {
    const next = { ...appliedFilters, type: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id);
  };

  const handleDietaryChange = (value: string) => {
    const next = { ...appliedFilters, dietaryPreference: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id);
  };

  const handleBasicUnitChange = (value: string) => {
    const next = { ...appliedFilters, basicUnit: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id);
  };

  const handleStatusChange = (value: string) => {
    const next = { ...appliedFilters, status: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      type: ALL_TYPES,
      dietaryPreference: ALL_DIETARY,
      basicUnit: ALL_BASIC_UNITS,
      status: ALL_STATUS,
    };
    setAppliedFilters(cleared);
    setSelectedCategory(null);
    setCategorySearchValue("");
    setParameter((prev) => {
      const {
        categoryId,
        type,
        dietaryPreference: dietaryPref,
        basicUnit: unit,
        status,
        ...rest
      } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="category" sx={{ minWidth: 200 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["categories.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        label="categories.name"
        isLoading={isFetchingCategories}
        options={categoriesData?.data}
        hasNextPage={categoriesData?.hasNextPage}
        pageNumber={categoryPage}
        changePage={changeCategoryPage}
        value={selectedCategory}
        onChangeAutoComplete={handleCategoryChange}
        onChangeTextField={(event) =>
          setCategorySearchValue(event.target.value)
        }
      />
    </Box>,
    <Box key="type">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["ingredients.type"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.type}
        onChange={(e) => handleTypeChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_TYPES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {INGREDIENT_TYPE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="dietaryPreference">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["ingredients.dietaryPreference"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.dietaryPreference}
        onChange={(e) => handleDietaryChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DIETARY} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIETARY_PREFERENCE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="basicUnit">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["ingredients.basicUnit"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.basicUnit}
        onChange={(e) => handleBasicUnitChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_BASIC_UNITS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {BASIC_UNIT_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="status">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["ingredients.status"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {STATUS_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button
        onClick={handleClear}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}
      >
        Clear filters
      </Button>
    </Box>,
  ];

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.mealPlanning.title"] },
          ]}
          currentPathName={"sidebar.ingredients"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  deleteAllQuery={deleteAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
                  addTitle="ingredients.add"
                  onChangeAddButton={() => {
                    navigate("/nutriplan/mealPlanning/ingredients/add");
                  }}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.ingredients().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="Ingredients"
                  onPageSizeChange={(pageSize: number) => {
                    changeLimit(`${pageSize}`);
                  }}
                  onPageChange={(pageNumber: number) => {
                    changePage(pageNumber + 1);
                  }}
                  pageSize={limit ?? 10}
                  columns={columns}
                  rows={data?.data ?? []}
                  loading={isFetching}
                  onSelectionModelChange={setSelectionModel}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        type: false,
                        tags: false,
                        waterPer100g: false,
                        carbsPer100Unit: false,
                        fatPer100Unit: false,
                        fiberPer100Unit: false,
                        proteinPer100Unit: false,
                        sugarPer100Unit: false,
                        caloriesPer100Unit: false,
                        caloriesUnit: false,
                      },
                    },
                  }}
                  onSortModelChange={() => {}}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {Modals}
    </>
  );
};

export default IngredientsPage;

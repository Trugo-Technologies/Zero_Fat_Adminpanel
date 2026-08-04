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
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllCategoriesQuery } from "src/pages/nutriplan-module/Categories/services/api";
import { endPoints } from "src/shared/end-points";
import { categoryType } from "src/types/enums";
import { ICategoriesListDto } from "src/types/modules/nutriplan/categories";
import { IIngredientsListDto } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import {
  ALL_BASIC_UNITS,
  ALL_CATEGORIES,
  ALL_STATUS,
  BASIC_UNIT_OPTIONS,
  STATUS_OPTIONS,
  buildIngredientFilterQueryParams,
  createDefaultIngredientFilters,
  IngredientAppliedFilters,
  selectSx,
} from "./ingredientFilterHelpers";
import {
  useDeleteAllIngredientsMutation,
  useGetAllIngredientsQuery,
} from "./services/api";
import useIngredients from "./useIngredients";

const IngredientsPage = () => {
  const navigate = useNavigate();
  const { messages, locale } = useIntl();
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

  const { data: categoriesData } = usePaginateData<ICategoriesListDto>(
    useGetAllCategoriesQuery,
    {},
    { categoryType: categoryType.Ingredient, pageSize: 200 }
  );

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllIngredientsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<IngredientAppliedFilters>(createDefaultIngredientFilters);

  const syncFiltersToQuery = useCallback(
    (filters: IngredientAppliedFilters) => {
      const filterParams = buildIngredientFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        categoryId: filterParams.categoryId,
        basicUnit: filterParams.basicUnit,
        status: filterParams.status,
      }));
    },
    [setParameter]
  );

  const updateFilters = (
    updater: (current: IngredientAppliedFilters) => IngredientAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleCategoryChange = (value: string) => {
    updateFilters((current) => ({ ...current, categoryId: value }));
  };

  const handleBasicUnitChange = (value: string) => {
    updateFilters((current) => ({ ...current, basicUnit: value }));
  };

  const handleStatusChange = (value: string) => {
    updateFilters((current) => ({ ...current, status: value }));
  };

  const handleClear = () => {
    const cleared = createDefaultIngredientFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      categoryId: undefined,
      basicUnit: undefined,
      status: undefined,
    }));
  };

  const advanceFiltersInputs = [
    <Box key="category">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["categories.name"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.categoryId}
        onChange={(e) => handleCategoryChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 200 }}
      >
        <MenuItem value={ALL_CATEGORIES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {(categoriesData?.data ?? []).map((category) => (
          <MenuItem key={category.id} value={category.id} sx={{ fontSize: 13 }}>
            {locale === "en-US" ? category.nameEn : category.nameAr}
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
                  successUrl={`${endPoints.ingredients().pathname}/filter`}
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

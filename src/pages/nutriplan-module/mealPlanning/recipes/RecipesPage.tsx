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
import { IRecipesListDto } from "src/types/modules/nutriplan/mealPlanning/recipes";
import {
  ALL_CATEGORIES,
  ALL_DIETARY,
  ALL_DIFFICULTY,
  DIETARY_CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  RecipeAppliedFilters,
  buildRecipeFilterQueryParams,
  createDefaultRecipeFilters,
  selectSx,
} from "./recipeFilterHelpers";
import { useGetAllRecipesQuery } from "./services/api";
import useRecipes from "./useRecipes";

const RecipesPage = () => {
  const navigate = useNavigate();
  const { messages, locale } = useIntl();
  const { selectionModel, setSelectionModel, columns, Modals } = useRecipes();
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
  } = usePaginateData<IRecipesListDto>(useGetAllRecipesQuery);

  const { data: categoriesData } = usePaginateData<ICategoriesListDto>(
    useGetAllCategoriesQuery,
    {},
    { categoryType: categoryType.Recipe, pageSize: 200 }
  );

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<RecipeAppliedFilters>(
    createDefaultRecipeFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: RecipeAppliedFilters) => {
      const filterParams = buildRecipeFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        categoryId: filterParams.categoryId,
        difficulty: filterParams.difficulty,
        dietaryCategory: filterParams.dietaryCategory,
      }));
    },
    [setParameter]
  );

  const updateFilters = (
    updater: (current: RecipeAppliedFilters) => RecipeAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleCategoryChange = (value: string) => {
    updateFilters((current) => ({ ...current, categoryId: value }));
  };

  const handleDifficultyChange = (value: string) => {
    updateFilters((current) => ({ ...current, difficulty: value }));
  };

  const handleDietaryCategoryChange = (value: string) => {
    updateFilters((current) => ({ ...current, dietaryCategory: value }));
  };

  const handleClear = () => {
    const cleared = createDefaultRecipeFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      categoryId: undefined,
      difficulty: undefined,
      dietaryCategory: undefined,
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
    <Box key="difficulty">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["recipes.difficulty"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.difficulty}
        onChange={(e) => handleDifficultyChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_DIFFICULTY} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIFFICULTY_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="dietaryCategory">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["recipes.dietaryCategories"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.dietaryCategory}
        onChange={(e) => handleDietaryCategoryChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DIETARY} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIETARY_CATEGORY_OPTIONS.map(({ value, labelKey }) => (
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
          currentPathName={"sidebar.recipes"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="recipes.add"
                  onChangeAddButton={() => {
                    navigate("/nutriplan/mealPlanning/recipes/add");
                  }}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.recipes().pathname}/filter`}
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
                  tableName="recipes"
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
                        mealTypes: false,
                        cuisine: false,
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

export default RecipesPage;

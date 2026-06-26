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
import { useGetAllMealTypesQuery } from "src/pages/nutriplan-module/MealTypes/services/api";
import { endPoints } from "src/shared/end-points";
import {
  categoryType,
  recipeDietaryCategories,
  recipesCuisine,
  recipesDifficulty,
} from "src/types/enums";
import { ICategories, ICategoriesListDto } from "src/types/modules/nutriplan/categories";
import { IMealTypes, IMealTypesListDto } from "src/types/modules/nutriplan/mealTypes";
import { IRecipesListDto } from "src/types/modules/nutriplan/mealPlanning/recipes";
import { useGetAllRecipesQuery } from "./services/api";
import useRecipes from "./useRecipes";

const ALL_DIFFICULTY = "All Difficulty";
const ALL_CUISINE = "All Cuisine";
const ALL_DIETARY = "All Dietary Categories";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const DIFFICULTY_OPTIONS = [
  { value: recipesDifficulty.Easy, labelKey: "recipes.difficulty.Easy" },
  { value: recipesDifficulty.Medium, labelKey: "recipes.difficulty.Medium" },
  { value: recipesDifficulty.Hard, labelKey: "recipes.difficulty.Hard" },
] as const;

const CUISINE_OPTIONS = Object.values(recipesCuisine).map((value) => ({
  value,
  labelKey: `recipes.cuisine.${value}`,
}));

const DIETARY_CATEGORY_OPTIONS = [
  {
    value: recipeDietaryCategories.Omnivore,
    labelKey: "recipes.dietaryCategories.Omnivore",
  },
  {
    value: recipeDietaryCategories.Pescatarian,
    labelKey: "recipes.dietaryCategories.Pescatarian",
  },
  { value: recipeDietaryCategories.Vegan, labelKey: "recipes.dietaryCategories.Vegan" },
  {
    value: recipeDietaryCategories.Vegetarian,
    labelKey: "recipes.dietaryCategories.Vegetarian",
  },
] as const;

type AppliedFilters = {
  difficulty: string;
  cuisine: string;
  dietaryCategory: string;
};

const RecipesPage = () => {
  const navigate = useNavigate();
  const { messages } = useIntl();
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
    { categoryType: categoryType.Recipe }
  );

  const {
    changePage: changeMealTypePage,
    data: mealTypesData,
    isFetching: isFetchingMealTypes,
    page: mealTypePage,
    setSearchValue: setMealTypeSearchValue,
    refetch: refetchMealTypes,
  } = usePaginateData<IMealTypesListDto>(useGetAllMealTypesQuery);

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategories | null>(
    null
  );
  const [selectedMealType, setSelectedMealType] = useState<IMealTypes | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    difficulty: ALL_DIFFICULTY,
    cuisine: ALL_CUISINE,
    dietaryCategory: ALL_DIETARY,
  });

  useEffect(() => {
    if (categoryPage && categoryPage > 1) refetchCategories();
  }, [categoryPage, refetchCategories]);

  useEffect(() => {
    if (mealTypePage && mealTypePage > 1) refetchMealTypes();
  }, [mealTypePage, refetchMealTypes]);

  const syncFiltersToQuery = useCallback(
    (
      filters: AppliedFilters,
      categoryId?: string | null,
      mealTypeId?: string | null
    ) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        categoryId: categoryId || undefined,
        mealTypeId: mealTypeId || undefined,
        difficulty:
          filters.difficulty === ALL_DIFFICULTY ? undefined : filters.difficulty,
        cuisine: filters.cuisine === ALL_CUISINE ? undefined : filters.cuisine,
        dietaryCategory:
          filters.dietaryCategory === ALL_DIETARY
            ? undefined
            : filters.dietaryCategory,
      }));
    },
    [setParameter]
  );

  const handleCategoryChange = (_event: unknown, value: ICategories | null) => {
    setSelectedCategory(value);
    syncFiltersToQuery(appliedFilters, value?.id ?? null, selectedMealType?.id);
  };

  const handleMealTypeChange = (_event: unknown, value: IMealTypes | null) => {
    setSelectedMealType(value);
    syncFiltersToQuery(appliedFilters, selectedCategory?.id, value?.id ?? null);
  };

  const handleDifficultyChange = (value: string) => {
    const next = { ...appliedFilters, difficulty: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id, selectedMealType?.id);
  };

  const handleCuisineChange = (value: string) => {
    const next = { ...appliedFilters, cuisine: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id, selectedMealType?.id);
  };

  const handleDietaryCategoryChange = (value: string) => {
    const next = { ...appliedFilters, dietaryCategory: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedCategory?.id, selectedMealType?.id);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      difficulty: ALL_DIFFICULTY,
      cuisine: ALL_CUISINE,
      dietaryCategory: ALL_DIETARY,
    };
    setAppliedFilters(cleared);
    setSelectedCategory(null);
    setSelectedMealType(null);
    setCategorySearchValue("");
    setMealTypeSearchValue("");
    setParameter((prev) => {
      const {
        categoryId,
        mealTypeId,
        difficulty,
        cuisine,
        dietaryCategory,
        ...rest
      } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
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
    <Box key="cuisine">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["recipes.cuisine"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.cuisine}
        onChange={(e) => handleCuisineChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}
      >
        <MenuItem value={ALL_CUISINE} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {CUISINE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
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
    <Box key="mealType" sx={{ minWidth: 200 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["sidebar.mealTypes"] as string}
      </Typography>
      <AppBaseAutoComplete
        label="sidebar.mealTypes"
        isLoading={isFetchingMealTypes}
        options={mealTypesData?.data}
        hasNextPage={mealTypesData?.hasNextPage}
        pageNumber={mealTypePage}
        changePage={changeMealTypePage}
        value={selectedMealType}
        onChangeAutoComplete={handleMealTypeChange}
        onChangeTextField={(event) =>
          setMealTypeSearchValue(event.target.value)
        }
      />
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
                  successUrl={`${endPoints.recipes().pathname}/search`}
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
                        dietaryCategories: false,
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

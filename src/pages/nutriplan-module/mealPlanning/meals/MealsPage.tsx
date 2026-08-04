/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IMealsListDto } from "src/types/modules/nutriplan/mealPlanning/meals";
import {
  ALL_STATUS,
  ALL_TYPES,
  MealAppliedFilters,
  buildMealFilterQueryParams,
  createDefaultMealFilters,
  selectSx,
} from "./mealFilterHelpers";
import { useGetAllMealsQuery } from "./services/api";
import useMeals from "./useMeals";

const numberInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  width: 130,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const MealsPage = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useMeals();
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
  } = usePaginateData<IMealsListDto>(useGetAllMealsQuery);

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MealAppliedFilters>(
    createDefaultMealFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: MealAppliedFilters) => {
      const filterParams = buildMealFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        isActive: filterParams.isActive,
        isAddOn: filterParams.isAddOn,
        priceMin: filterParams.priceMin,
        priceMax: filterParams.priceMax,
      }));
    },
    [setParameter]
  );

  const updateFilters = (
    updater: (current: MealAppliedFilters) => MealAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleStatusChange = (value: string) => {
    updateFilters((current) => ({ ...current, status: value }));
  };

  const handleAddOnChange = (value: string) => {
    updateFilters((current) => ({ ...current, addOn: value }));
  };

  const handlePriceMinChange = (value: string) => {
    updateFilters((current) => ({ ...current, priceMin: value }));
  };

  const handlePriceMaxChange = (value: string) => {
    updateFilters((current) => ({ ...current, priceMax: value }));
  };

  const handleClear = () => {
    setAppliedFilters(createDefaultMealFilters());
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      isActive: undefined,
      isAddOn: undefined,
      priceMin: undefined,
      priceMax: undefined,
    }));
  };

  const advanceFiltersInputs = [
    <Box key="status">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.status"] as string}
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
        <MenuItem value="Active" sx={{ fontSize: 13 }}>
          {messages["columns.active"] as string}
        </MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
          {messages["columns.inactive"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="isAddOn">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["meals.isAddOn"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.addOn}
        onChange={(e) => handleAddOnChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_TYPES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="AddOn" sx={{ fontSize: 13 }}>
          {messages["common.yes"] as string}
        </MenuItem>
        <MenuItem value="Regular" sx={{ fontSize: 13 }}>
          {messages["common.no"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="priceMin">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["meals.filter.minPrice"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={appliedFilters.priceMin}
        onChange={(e) => handlePriceMinChange(e.target.value)}
        sx={numberInputSx}
        inputProps={{ min: 0 }}
      />
    </Box>,
    <Box key="priceMax">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["meals.filter.maxPrice"] as string}
      </Typography>
      <OutlinedInput
        type="number"
        size="small"
        value={appliedFilters.priceMax}
        onChange={(e) => handlePriceMaxChange(e.target.value)}
        sx={numberInputSx}
        inputProps={{ min: 0 }}
      />
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
          currentPathName={"sidebar.meals"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="meals.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.meals().pathname}/filter`}
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
                  tableName="meals"
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
                        allergens: false,
                        weightInGrams: false,
                        calories: false,
                        fat: false,
                        carbs: false,
                        protein: false,
                        water: false,
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

export default MealsPage;

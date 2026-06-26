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
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { mealPlansDefaultDietitianGoal } from "src/types/enums";
import { IMealPlansListDto } from "src/types/modules/nutriplan/mealPlans";
import { useGetAllMealPlansQuery } from "./services/api";
import useMealPlans from "./useMealPlans";

const ALL_DIETITIAN_GOALS = "All Dietitian Goals";

const DIETITIAN_GOAL_OPTIONS = [
  {
    value: mealPlansDefaultDietitianGoal.BuildMuscles,
    labelKey: "defaultDietitianGoal.type.BuildMuscles",
  },
  {
    value: mealPlansDefaultDietitianGoal.GainWeight,
    labelKey: "defaultDietitianGoal.type.GainWeight",
  },
  {
    value: mealPlansDefaultDietitianGoal.GeneralHealth,
    labelKey: "defaultDietitianGoal.type.GeneralHealth",
  },
  {
    value: mealPlansDefaultDietitianGoal.LoseWeight,
    labelKey: "defaultDietitianGoal.type.LoseWeight",
  },
  {
    value: mealPlansDefaultDietitianGoal.LoseFat,
    labelKey: "defaultDietitianGoal.type.LoseFat",
  },
] as const;

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 180,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const MealPlansPages = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useMealPlans();
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
  } = usePaginateData<IMealPlansListDto>(useGetAllMealPlansQuery);

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedDietitianGoal, setAppliedDietitianGoal] =
    useState(ALL_DIETITIAN_GOALS);

  const syncDietitianGoalToQuery = useCallback(
    (value: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        defaultDietitianGoal:
          value === ALL_DIETITIAN_GOALS ? undefined : value,
      }));
    },
    [setParameter]
  );

  const handleDietitianGoalChange = (value: string) => {
    setAppliedDietitianGoal(value);
    syncDietitianGoalToQuery(value);
  };

  const handleClear = () => {
    setAppliedDietitianGoal(ALL_DIETITIAN_GOALS);
    setParameter((prev) => {
      const { defaultDietitianGoal: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="defaultDietitianGoal">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["mealPlans.defaultDietitianGoal"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedDietitianGoal}
        onChange={(e) => handleDietitianGoalChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_DIETITIAN_GOALS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIETITIAN_GOAL_OPTIONS.map(({ value, labelKey }) => (
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
            { name: messages["sidebar.setting.title"] },
          ]}
          currentPathName={"sidebar.mealPlans"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="mealPlans.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.mealPlans().pathname}/search`}
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
                  tableName="mealPlans"
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
                  initialState={initialDataGridState}
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

export default MealPlansPages;

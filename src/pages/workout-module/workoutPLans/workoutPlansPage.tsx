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
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllPlanGoalsQuery } from "src/pages/workout-module/planGoals/services/api";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { endPoints } from "src/shared/end-points";
import { workoutEnvironment, workoutLevel } from "src/types/enums";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import { IPlanGoalsListDto } from "src/types/modules/workout/planGoals";
import {
  useActiveAllPlansMutation,
  useDeleteAllPlansMutation,
  useGetAllPlansQuery,
} from "./services/api";
import useWorkoutPlans from "./useWorkoutPlans";
import {
  ALL_ENVIRONMENTS,
  ALL_LEVELS,
  ALL_PLAN_GOALS,
  ALL_STATUS,
  ALL_TRAINERS,
  createDefaultPlanFilters,
  PlanFilters,
  selectSx,
} from "./planFilterHelpers";

function WorkoutPlansPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    refetch,
    sortBy,
    totalRecords,
    setSearchValue,
    page,
    limit,
    isFetching,
    setParameter,
  } = usePaginateData(useGetAllPlansQuery);

  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useWorkoutPlans();

  const { data: trainersData, isFetching: isFetchingTrainers } =
    usePaginateData<ITrainersListDto>(useGetAllTrainersQuery, undefined, {
      pageNumber: 1,
      pageSize: 100,
    });

  const { data: planGoalsData, isFetching: isFetchingPlanGoals } =
    usePaginateData<IPlanGoalsListDto>(useGetAllPlanGoalsQuery, undefined, {
      pageNumber: 1,
      pageSize: 100,
    });

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllPlansMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllPlansMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<PlanFilters>(
    createDefaultPlanFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: PlanFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        level: filters.level === ALL_LEVELS ? undefined : filters.level,
        environment:
          filters.environment === ALL_ENVIRONMENTS
            ? undefined
            : filters.environment,
        isActive:
          filters.status === "Active"
            ? true
            : filters.status === "Inactive"
              ? false
              : undefined,
        trainerId:
          filters.trainerId === ALL_TRAINERS ? undefined : filters.trainerId,
        planGoalId:
          filters.planGoalId === ALL_PLAN_GOALS
            ? undefined
            : filters.planGoalId,
      }));
    },
    [setParameter]
  );

  const handleFilterChange = (next: PlanFilters) => {
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClear = () => {
    const cleared = createDefaultPlanFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const {
        level,
        environment,
        isActive,
        trainerId,
        planGoalId,
        ...rest
      } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const filterLabelSx = {
    fontSize: 12,
    fontWeight: 700,
    color: "text.secondary",
    mb: 1,
  };

  const trainers = trainersData?.data ?? [];
  const planGoals = planGoalsData?.data ?? [];

  const advanceFiltersInputs = [
    <Box key="level">
      <Typography sx={filterLabelSx}>
        {messages["workouts.level"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.level}
        onChange={(e) =>
          handleFilterChange({ ...appliedFilters, level: e.target.value })
        }
        sx={selectSx}
      >
        <MenuItem value={ALL_LEVELS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value={workoutLevel.Beginner} sx={{ fontSize: 13 }}>
          {messages["workouts.level.Beginner"] as string}
        </MenuItem>
        <MenuItem value={workoutLevel.Intermediate} sx={{ fontSize: 13 }}>
          {messages["workouts.level.Intermediate"] as string}
        </MenuItem>
        <MenuItem value={workoutLevel.Advanced} sx={{ fontSize: 13 }}>
          {messages["workouts.level.Advanced"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="environment">
      <Typography sx={filterLabelSx}>
        {messages["workouts.environment"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.environment}
        onChange={(e) =>
          handleFilterChange({
            ...appliedFilters,
            environment: e.target.value,
          })
        }
        sx={selectSx}
      >
        <MenuItem value={ALL_ENVIRONMENTS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value={workoutEnvironment.Home} sx={{ fontSize: 13 }}>
          {messages["workouts.environment.Home"] as string}
        </MenuItem>
        <MenuItem value={workoutEnvironment.Gym} sx={{ fontSize: 13 }}>
          {messages["workouts.environment.Gym"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="status">
      <Typography sx={filterLabelSx}>
        {messages["common.status"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.status}
        onChange={(e) =>
          handleFilterChange({ ...appliedFilters, status: e.target.value })
        }
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
    <Box key="trainer" sx={{ minWidth: 180 }}>
      <Typography sx={filterLabelSx}>
        {messages["trainers.name"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.trainerId}
        disabled={isFetchingTrainers}
        onChange={(e) =>
          handleFilterChange({ ...appliedFilters, trainerId: e.target.value })
        }
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_TRAINERS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {trainers.map((trainer) => (
          <MenuItem key={trainer.id} value={trainer.id} sx={{ fontSize: 13 }}>
            {getValueBasedOnCurrentLanguage(trainer.nameAr, trainer.nameEn)}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="planGoal" sx={{ minWidth: 180 }}>
      <Typography sx={filterLabelSx}>
        {messages["workoutPlans.planGoal"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.planGoalId}
        disabled={isFetchingPlanGoals}
        onChange={(e) =>
          handleFilterChange({ ...appliedFilters, planGoalId: e.target.value })
        }
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_PLAN_GOALS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {planGoals.map((goal) => (
          <MenuItem key={goal.id} value={goal.id} sx={{ fontSize: 13 }}>
            {getValueBasedOnCurrentLanguage(goal.nameAr, goal.nameEn)}
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
            { name: messages["sidebar.workoutManagement.title"] },
            { name: messages["sidebar.training.title"] },
          ]}
          currentPathName={"sidebar.workoutPlan"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="workoutPlan.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.planEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  deleteAllQuery={deleteAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
                  activeAllQuery={activeAllQuery}
                  activeAllQueryLoading={activeAllLoading}
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
                  tableName="plans"
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
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result ?? []);
                  }}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {Modals}
    </>
  );
}

export default WorkoutPlansPage;

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
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllTrainersQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { useGetAllWorkoutTypesQuery } from "src/pages/workout-module/workoutTypes/services/api";
import { endPoints } from "src/shared/end-points";
import { workoutFormat, workoutLevel } from "src/types/enums";
import { ITrainer, ITrainersListDto } from "src/types/modules/training/trainers";
import { IWorkoutsListDto } from "src/types/modules/workout/workouts";
import {
  IWorkoutType,
  IWorkoutTypesListDto,
} from "src/types/modules/workout/workoutTypes";
import {
  useActiveAllWorkoutsMutation,
  useDeleteAllWorkoutsMutation,
  useGetAllWorkoutsQuery,
} from "./services/api";
import useWorkouts from "./useWorkouts";
import {
  ALL_FORMATS,
  ALL_LEVELS,
  ALL_STATUS,
  createDefaultWorkoutFilters,
  selectSx,
  WorkoutFilters,
} from "./workoutFilterHelpers";

const WorkoutPages = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useWorkouts();

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
  } = usePaginateData<IWorkoutsListDto>(useGetAllWorkoutsQuery);

  const {
    changePage: changeTrainerPage,
    data: trainersData,
    isFetching: isFetchingTrainers,
    page: trainerPage,
    setSearchValue: setTrainerSearchValue,
    refetch: refetchTrainers,
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);

  const {
    changePage: changeWorkoutTypePage,
    data: workoutTypesData,
    isFetching: isFetchingWorkoutTypes,
    page: workoutTypePage,
    setSearchValue: setWorkoutTypeSearchValue,
    refetch: refetchWorkoutTypes,
  } = usePaginateData<IWorkoutTypesListDto>(useGetAllWorkoutTypesQuery);

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllWorkoutsMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllWorkoutsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<WorkoutFilters>(
    createDefaultWorkoutFilters
  );
  const [selectedTrainer, setSelectedTrainer] = useState<ITrainer | null>(null);
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<IWorkoutType | null>(null);

  useEffect(() => {
    if (trainerPage && trainerPage > 1) refetchTrainers();
  }, [trainerPage, refetchTrainers]);

  useEffect(() => {
    if (workoutTypePage && workoutTypePage > 1) refetchWorkoutTypes();
  }, [workoutTypePage, refetchWorkoutTypes]);

  const syncFiltersToQuery = useCallback(
    (
      filters: WorkoutFilters,
      ids: {
        trainerId?: string | null;
        workoutTypeId?: string | null;
      } = {}
    ) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        format: filters.format === ALL_FORMATS ? undefined : filters.format,
        level: filters.level === ALL_LEVELS ? undefined : filters.level,
        isActive:
          filters.status === "Active"
            ? true
            : filters.status === "Inactive"
              ? false
              : undefined,
        trainerId: ids.trainerId || undefined,
        workoutTypeId: ids.workoutTypeId || undefined,
      }));
    },
    [setParameter]
  );

  const currentIds = () => ({
    trainerId: selectedTrainer?.id ?? null,
    workoutTypeId: selectedWorkoutType?.id ?? null,
  });

  const handleFilterChange = (next: WorkoutFilters) => {
    setAppliedFilters(next);
    syncFiltersToQuery(next, currentIds());
  };

  const handleClear = () => {
    const cleared = createDefaultWorkoutFilters();
    setAppliedFilters(cleared);
    setSelectedTrainer(null);
    setSelectedWorkoutType(null);
    setTrainerSearchValue("");
    setWorkoutTypeSearchValue("");
    setParameter((prev) => {
      const { format, level, isActive, trainerId, workoutTypeId, ...rest } =
        prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const filterLabelSx = {
    fontSize: 12,
    fontWeight: 700,
    color: "text.secondary",
    mb: 1,
  };

  const advanceFiltersInputs = [
    <Box key="format">
      <Typography sx={filterLabelSx}>
        {messages["workouts.format"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.format}
        onChange={(e) =>
          handleFilterChange({ ...appliedFilters, format: e.target.value })
        }
        sx={selectSx}
      >
        <MenuItem value={ALL_FORMATS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value={workoutFormat.SetReps} sx={{ fontSize: 13 }}>
          {messages["workouts.format.SetsReps"] as string}
        </MenuItem>
        <MenuItem value={workoutFormat.FollowAlong} sx={{ fontSize: 13 }}>
          {messages["workouts.format.FollowAlong"] as string}
        </MenuItem>
      </Select>
    </Box>,
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
    <Box key="trainer" sx={{ minWidth: 200 }}>
      <Typography sx={filterLabelSx}>
        {messages["trainers.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        isLoading={isFetchingTrainers}
        options={trainersData?.data}
        hasNextPage={trainersData?.hasNextPage}
        pageNumber={trainerPage}
        changePage={changeTrainerPage}
        value={selectedTrainer}
        onChangeAutoComplete={(_event, value: ITrainer | null) => {
          setSelectedTrainer(value);
          syncFiltersToQuery(appliedFilters, {
            ...currentIds(),
            trainerId: value?.id ?? null,
          });
        }}
        onChangeTextField={(event) =>
          setTrainerSearchValue(event.target.value)
        }
      />
    </Box>,
    <Box key="workoutType" sx={{ minWidth: 200 }}>
      <Typography sx={filterLabelSx}>
        {messages["workoutTypes.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        isLoading={isFetchingWorkoutTypes}
        options={workoutTypesData?.data}
        hasNextPage={workoutTypesData?.hasNextPage}
        pageNumber={workoutTypePage}
        changePage={changeWorkoutTypePage}
        value={selectedWorkoutType}
        onChangeAutoComplete={(_event, value: IWorkoutType | null) => {
          setSelectedWorkoutType(value);
          syncFiltersToQuery(appliedFilters, {
            ...currentIds(),
            workoutTypeId: value?.id ?? null,
          });
        }}
        onChangeTextField={(event) =>
          setWorkoutTypeSearchValue(event.target.value)
        }
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
            { name: messages["sidebar.workoutManagement.title"] },
            { name: messages["sidebar.training.title"] },
          ]}
          currentPathName={"sidebar.workouts"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="workouts.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.workouts().pathname}/search`}
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
                  tableName="workouts"
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
                  initialState={initialDataGridState}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
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

export default WorkoutPages;

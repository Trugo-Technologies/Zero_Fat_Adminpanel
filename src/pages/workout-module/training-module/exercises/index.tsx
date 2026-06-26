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
import { endPoints } from "src/shared/end-points";
import { exerciseType } from "src/types/enums";
import { IExercisesListDto } from "src/types/modules/training/exercises";
import { ITrainer, ITrainersListDto } from "src/types/modules/training/trainers";
import {
  useActiveAllExercisesMutation,
  useDeleteAllExercisesMutation,
  useGetAllExercisesQuery,
} from "./services/api";
import useExercises from "./useExercises";

const ALL_TYPES = "All Types";
const ALL_STATUS = "All Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const ExercisesPage = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useExercises();
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
  } = usePaginateData<IExercisesListDto>(useGetAllExercisesQuery);

  const {
    changePage: changeTrainerPage,
    data: trainersData,
    isFetching: isFetchingTrainers,
    page: trainerPage,
    setSearchValue: setTrainerSearchValue,
    refetch: refetchTrainers,
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllExercisesMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllExercisesMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    type: ALL_TYPES,
    status: ALL_STATUS,
  });
  const [selectedTrainer, setSelectedTrainer] = useState<ITrainer | null>(null);

  useEffect(() => {
    if (trainerPage && trainerPage > 1) refetchTrainers();
  }, [trainerPage, refetchTrainers]);

  const syncFiltersToQuery = useCallback(
    (
      filters: { type: string; status: string },
      trainerId?: string | null
    ) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        type: filters.type === ALL_TYPES ? undefined : filters.type,
        trainerId: trainerId || undefined,
        isActive:
          filters.status === "Active"
            ? true
            : filters.status === "Inactive"
              ? false
              : undefined,
      }));
    },
    [setParameter]
  );

  const handleTypeChange = (value: string) => {
    const next = { ...appliedFilters, type: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedTrainer?.id);
  };

  const handleStatusChange = (value: string) => {
    const next = { ...appliedFilters, status: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedTrainer?.id);
  };

  const handleTrainerChange = (_event: unknown, value: ITrainer | null) => {
    setSelectedTrainer(value);
    syncFiltersToQuery(appliedFilters, value?.id ?? null);
  };

  const handleClear = () => {
    const cleared = { type: ALL_TYPES, status: ALL_STATUS };
    setAppliedFilters(cleared);
    setSelectedTrainer(null);
    setTrainerSearchValue("");
    setParameter((prev) => {
      const { type, trainerId, isActive, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="type">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["exercises.type"] as string}
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
        <MenuItem value={exerciseType.Reps} sx={{ fontSize: 13 }}>
          {messages["exercises.type.Reps"] as string}
        </MenuItem>
        <MenuItem value={exerciseType.WeightAndReps} sx={{ fontSize: 13 }}>
          {messages["exercises.type.WeightAndReps"] as string}
        </MenuItem>
        <MenuItem value={exerciseType.Duration} sx={{ fontSize: 13 }}>
          {messages["exercises.type.Duration"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="trainer" sx={{ minWidth: 200 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["trainers.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        label="trainers.name"
        isLoading={isFetchingTrainers}
        options={trainersData?.data}
        hasNextPage={trainersData?.hasNextPage}
        pageNumber={trainerPage}
        changePage={changeTrainerPage}
        value={selectedTrainer}
        onChangeAutoComplete={handleTrainerChange}
        onChangeTextField={(value) => setTrainerSearchValue(value)}
      />
    </Box>,
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
          currentPathName={"sidebar.exercises"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="exercises.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.exercises().pathname}/search`}
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
                  tableName="exercises"
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

export default ExercisesPage;

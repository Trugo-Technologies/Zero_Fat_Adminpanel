/** @format */

import { Box, Button, Card, CardContent, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { trainerType } from "src/types/enums";
import { ITrainersListDto } from "src/types/modules/training/trainers";
import {
  useActiveAllTrainersMutation,
  useDeleteAllTrainersMutation,
  useGetAllTrainersQuery,
} from "./services/api";
import useTrainers from "./useTrainers";

const ALL_TYPES = "All Types";
const ALL_STATUS = "All Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const TrainersPages = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useTrainers();
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
  } = usePaginateData<ITrainersListDto>(useGetAllTrainersQuery);

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllTrainersMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllTrainersMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    type: ALL_TYPES,
    status: ALL_STATUS,
  });

  const syncFiltersToQuery = useCallback(
    (filters: { type: string; status: string }) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        type: filters.type === ALL_TYPES ? undefined : filters.type,
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
    syncFiltersToQuery(next);
  };

  const handleStatusChange = (value: string) => {
    const next = { ...appliedFilters, status: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClear = () => {
    const cleared = { type: ALL_TYPES, status: ALL_STATUS };
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const { type, isActive, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="type">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
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
        <MenuItem value={trainerType.Trainer} sx={{ fontSize: 13 }}>
          {messages["trainers.type.Trainer"] as string}
        </MenuItem>
        <MenuItem value={trainerType.Athlete} sx={{ fontSize: 13 }}>
          {messages["trainers.type.Athlete"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="status">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
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
          currentPathName={"sidebar.trains"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="trains.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.trainers().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  deleteAllQuery={deleteAllQuery}
                  activeAllQuery={activeAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
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
                  tableName="trainers"
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
                  checkboxSelection
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

export default TrainersPages;

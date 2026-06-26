/** @format */

import { Card, CardContent, Grid, Box, Typography, Select, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IWorkoutsListDto } from "src/types/modules/workout/workouts";
import {
  useActiveAllWorkoutsMutation,
  useDeleteAllWorkoutsMutation,
  useGetAllWorkoutsQuery,
} from "./services/api";
import useWorkouts from "./useWorkouts";

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
  } = usePaginateData<IWorkoutsListDto>(useGetAllWorkoutsQuery);

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllWorkoutsMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllWorkoutsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ format: "All Formats", level: "All Levels", status: "All Status" });

  const handleClear = () => {
    setAppliedFilters({ format: "All Formats", level: "All Levels", status: "All Status" });
  };

  const advanceFiltersInputs = [
    <Box key="format">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Format</Typography>
      <Select size="small" value={appliedFilters.format} onChange={(e) => setAppliedFilters({...appliedFilters, format: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Formats" sx={{ fontSize: 13 }}>All Formats</MenuItem>
        <MenuItem value="Video" sx={{ fontSize: 13 }}>Video</MenuItem>
        <MenuItem value="Audio" sx={{ fontSize: 13 }}>Audio</MenuItem>
        <MenuItem value="Text" sx={{ fontSize: 13 }}>Text</MenuItem>
      </Select>
    </Box>,
    <Box key="level">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Level</Typography>
      <Select size="small" value={appliedFilters.level} onChange={(e) => setAppliedFilters({...appliedFilters, level: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Levels" sx={{ fontSize: 13 }}>All Levels</MenuItem>
        <MenuItem value="Beginner" sx={{ fontSize: 13 }}>Beginner</MenuItem>
        <MenuItem value="Intermediate" sx={{ fontSize: 13 }}>Intermediate</MenuItem>
        <MenuItem value="Advanced" sx={{ fontSize: 13 }}>Advanced</MenuItem>
      </Select>
    </Box>,
    <Box key="status">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Status</Typography>
      <Select size="small" value={appliedFilters.status} onChange={(e) => setAppliedFilters({...appliedFilters, status: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Status" sx={{ fontSize: 13 }}>All Status</MenuItem>
        <MenuItem value="Active" sx={{ fontSize: 13 }}>Active</MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>Inactive</MenuItem>
      </Select>
    </Box>,
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button onClick={handleClear} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 700, "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" }, height: 36, px: 2, borderRadius: 2 }}>
        Clear filters
      </Button>
    </Box>
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
                  addTitle='workouts.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.workoutBodyParts().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  deleteAllQuery={deleteAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
                  activeAllQuery={activeAllQuery}
                  activeAllQueryLoading={activeAllLoading}
                  showAdvanceFiltersButton={true}
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='workouts'
                  //for pagination
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
                  //for selection
                  onSelectionModelChange={setSelectionModel}
                  initialState={initialDataGridState}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  //for sorting
                  onSortModelChange={(result: string[] | null) => {
                    // setSearch({
                    //   ...search,
                    //   orderBy: result,
                    // });
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
};

export default WorkoutPages;
